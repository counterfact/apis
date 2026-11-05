import assert from "node:assert/strict";
import test from "node:test";
import { createScenarioRunner } from "../test-support/scenarios.js";
import { createDispatcherHarness } from "../test-support/dispatcher.js";
import * as scenarios from "../api/scenarios/index.js";
import {resetModels} from "../api/scenarios/models.js";
const workflow = { nodes: { start: { type: "start" } }, edges: {} };
const draft = {
  conversation_config: { agent: { first_message: "Draft greeting" } },
  platform_settings: {},
  workflow,
  name: "Draft agent",
};

test("agent mutations create versioned defaults and publish immutable main and feature snapshots", async () => {
  const r = await createScenarioRunner();
  await r.run(scenarios.startup);
  const a = r.loadContext("/convai/agents"),
    c = r.loadContext("/convai/agents/{agent_id}/branches");
  const id = a.createAgent({ conversation_config: {} }).value!.agent_id,
    initial = a.getAgent(id)!;
  assert.ok(initial.main_branch_id);
  assert.ok(initial.version_id);
  assert.equal(
    initial.conversation_config.agent!.prompt!.llm,
    "gemini-3.5-flash",
  );
  assert.equal(initial.conversation_config.tts!.model_id, "eleven_v4_turbo");
  assert.equal(c.list(id).results.length, 1);
  assert.equal(c.get(id,initial.main_branch_id!).current_live_percentage,100);
  assert.equal(c.deployments(id).results[0].is_active,true);
  const branch = c.createBranch(id, {
    parent_version_id: initial.version_id,
    name: "Feature",
    description: "",
    conversation_config: { agent: { first_message: "Feature" } },
  });
  assert.equal(
    c.version(id, branch.created_version_id).parents.out_of_branch_parent_id,
    initial.version_id,
  );
  const updated = a.updateAgent(
    id,
    {
      conversation_config: { agent: { first_message: "Published" } },
      version_description: "Second",
    },
    branch.created_branch_id,
  ).value!;
  assert.equal(updated.conversation_config.agent!.first_message, "Published");
  assert.equal(
    c.version(id, updated.version_id!).parents.in_branch_parent_id,
    branch.created_version_id,
  );
  assert.equal(
    c.select(id, { version_id: branch.created_version_id }).conversation_config
      .agent!.first_message,
    "Feature",
  );
  assert.equal(a.getAgent(id)!.version_id, initial.version_id);
  a.updateAgent(id, { name: "Main updated" });
  assert.equal(a.getAgent(id)!.name, "Main updated");
  assert.equal(
    c.select(id, { version_id: initial.version_id }).name,
    "New agent",
  );
  await r.run(scenarios.reset);
  assert.equal(c.drafts.size, 0);
  assert.equal(c.branches.size, 2);
});

test("agent drafts and procedure publication are atomic and resettable", async () => {
  const r = await createScenarioRunner();
  await r.run(scenarios.startup);
  const a = r.loadContext("/convai/agents"),
    c = r.loadContext("/convai/agents/{agent_id}/branches"),
    p = r.loadContext(
      "/convai/agents/{agent_id}/branches/{branch_id}/procedures",
    );
  const original = a.getAgent("sim-agent")!;
  c.saveDraft("sim-agent", "sim-main-branch", draft);
  assert.deepEqual(a.getAgent("sim-agent"), original);
  p.updateDraft("sim-agent", "sim-main-branch", "sim-procedure", {
    name: "New support",
    content: "Local edit",
    type: "free_form",
  });
  const before = structuredClone({
    drafts: c.drafts,
    versions: c.versions,
    procedures: p.versions,
    working: p.working,
  });
  assert.throws(() =>
    c.publish("sim-agent", "sim-main-branch", {
      procedures: { bad: { procedure_id: "bad", version_id: "missing" } },
    }),
  );
  assert.deepEqual(
    {
      drafts: c.drafts,
      versions: c.versions,
      procedures: p.versions,
      working: p.working,
    },
    before,
  );
  const published = a.updateAgent("sim-agent", {
    version_description: "Saved draft",
  }).value!;
  assert.equal(published.name, "Draft agent");
  assert.equal(
    published.conversation_config.agent!.first_message,
    "Draft greeting",
  );
  assert.notEqual(
    published.procedures!["sim-procedure"].version_id,
    "sim-procedure-version",
  );
  assert.equal(
    p.get("sim-agent", "sim-main-branch", "sim-procedure").name,
    "New support",
  );
  assert.equal(
    p.get("sim-agent", "sim-main-branch", "sim-procedure", {
      agent_version_id: "sim-agent-version-main",
    }).name,
    "Published support",
  );
  assert.equal(c.drafts.size, 0);
  assert.equal(p.working.has("sim-main-branch"), false);
  c.saveDraft("sim-agent", "sim-main-branch", draft);
  c.deleteDraft("sim-agent", "sim-main-branch");
  assert.equal(c.drafts.size, 0);
  await r.run(scenarios.reset);
  assert.deepEqual(a.getAgent("sim-agent"), original);
});

test("branch creation uses historical parents and only explicitly includes procedure drafts", async () => {
  const r = await createScenarioRunner();
  await r.run(scenarios.startup);
  const a = r.loadContext("/convai/agents"),
    c = r.loadContext("/convai/agents/{agent_id}/branches"),
    p = r.loadContext(
      "/convai/agents/{agent_id}/branches/{branch_id}/procedures",
    );
  p.updateDraft("sim-agent", "sim-main-branch", "sim-procedure", {
    name: "Branch support",
    content: "Edit",
    type: "free_form",
  });
  const fork = c.createBranch("sim-agent", {
    parent_version_id: "sim-agent-version-main",
    name: "Fork",
    description: "",
    include_draft: true,
  });
  assert.equal(
    p.get("sim-agent", fork.created_branch_id, "sim-procedure").name,
    "Branch support",
  );
  assert.equal(
    p.draft("sim-agent", "sim-main-branch", "sim-procedure").name,
    "Branch support",
  );
  a.updateAgent("sim-agent", {
    procedures: {},
    conversation_config: { agent: { first_message: "Latest" } },
  });
  const history = c.createBranch("sim-agent", {
    parent_version_id: "sim-agent-version-main",
    name: "History",
    description: "",
  });
  assert.equal(
    p.get("sim-agent", history.created_branch_id, "sim-procedure").name,
    "Published support",
  );
  assert.throws(() =>
    c.createBranch("sim-agent", {
      parent_version_id: "sim-agent-version-main",
      name: "Invalid",
      description: "",
      include_draft: true,
    }),
  );
  assert.throws(() =>
    c.createBranch("sim-agent", {
      parent_version_id: "sim-agent-version-main",
      name: "History",
      description: "",
    }),
  );
});

test("Dispatcher agent mutations validate contracts and expose isolated versioned state", async () => {
  const h = await createDispatcherHarness();
  const req = async (
    path: string,
    method = "GET",
    body?: unknown,
    status = 200,
  ) => {
    const res = await h.request(`/v1/convai/agents${path}`, {
      method,
      ...(body === undefined
        ? {}
        : {
            headers: { "content-type": "application/json" },
            body: JSON.stringify(body),
          }),
    });
    assert.equal(res.status, status, await res.clone().text());
    return res;
  };
  const id = (
    await (
      await req("/create", "POST", { conversation_config: {}, workflow: {} })
    ).json()
  ).agent_id;
  const initial = await (await req(`/${id}`)).json();
  assert.ok(initial.main_branch_id);
  assert.ok(initial.version_id);
  const fork = await (
    await req(`/${id}/branches`, "POST", {
      parent_version_id: initial.version_id,
      name: "Preview",
      description: "",
    })
  ).json();
  await req(`/${id}/drafts?branch_id=${fork.created_branch_id}`, "POST", draft);
  assert.equal(
    (await (await req(`/${id}?branch_id=${fork.created_branch_id}`)).json())
      .name,
    "New agent",
  );
  const published = await (
    await req(`/${id}?branch_id=${fork.created_branch_id}`, "PATCH", {
      tags: ["preview"],
    })
  ).json();
  assert.equal(published.name, "Draft agent");
  assert.deepEqual(published.tags, ["preview"]);
  assert.equal(
    (await (await req(`/${id}?version_id=${fork.created_version_id}`)).json())
      .name,
    "New agent",
  );
  assert.equal((await (await req(`/${id}`)).json()).name, "New agent");
  await req(
    `/${id}?include_procedure_generated_workflow_elements=true`,
    "PATCH",
    {},
    400,
  );
  await req(
    `/${id}/branches`,
    "POST",
    { parent_version_id: "missing", name: "Bad", description: "" },
    404,
  );
  await req(
    `/${id}/branches`,
    "POST",
    { parent_version_id: initial.version_id, name: "Preview", description: "" },
    409,
  );
  await req(
    "/create",
    "POST",
    { conversation_config: { tts: { voice_id: "missing" } } },
    400,
  );
  await req("/create", "POST", {
    conversation_config: {
      tts: { model_id: "eleven_v4_turbo", voice_id: "sim-narrator" },
    },
  });
  await req(`/${id}/drafts`, "POST", draft, 400);
  await req("/create", "POST", { conversation_config: "bad" }, 400);
  await req(`/${id}?branch_id=missing`, "PATCH", {}, 404);
  await req(`/${id}/branches/${fork.created_branch_id}`, "PATCH", {
    is_archived: true,
  });
  await req(`/${id}?branch_id=${fork.created_branch_id}`, "PATCH", {}, 409);
  await h.scenario("reset");
  await req(`/${id}`, "GET", undefined, 404);
});

test("configuration failures preserve allocation and use live catalog maps after replacement", async () => {
  const r = await createScenarioRunner(); await r.run(scenarios.startup);
  const a=r.loadContext("/convai/agents"),c=r.loadContext("/convai/agents/{agent_id}/branches");
  const before=structuredClone({agents:a.agents,branches:c.branches,versions:c.versions});
  for(const body of [
    {conversation_config:{tts:{voice_id:"missing"}}},
    {conversation_config:{tts:{model_id:"music_v1"}}},
    {conversation_config:{agent:{prompt:{llm:"not-a-model"}}}},
    {conversation_config:{},workflow:{nodes:{start:{type:"start"}},edges:{loop:{source:"start",target:"start"}}}},
  ])assert.equal(a.createAgent(body).error,"invalid_agent");
  assert.deepEqual({agents:a.agents,branches:c.branches,versions:c.versions},before);
  const id=a.createAgent({conversation_config:{}}).value!.agent_id;
  assert.equal(id,"sim-agent-created-1");
  const initial=a.getAgent(id)!;
  await r.run(scenarios.emptyModels);
  assert.throws(()=>a.updateAgent(id,{name:"No model"}),{code:"invalid_agent_lifecycle_request"});
  assert.deepEqual(a.getAgent(id),initial);
  await r.run(resetModels);
  assert.equal(a.updateAgent(id,{name:"Valid again"}).value!.name,"Valid again");
  await r.run(scenarios.emptyAgentLifecycle);
  assert.equal(c.drafts.size,0); assert.equal(c.nextBranch,0); assert.equal(c.nextVersion,0);
});

test("Dispatcher publishes procedure drafts and rejects invalid references without discarding edits", async () => {
  const h=await createDispatcherHarness(),base="/v1/convai/agents/sim-agent";
  const json=async(path:string,method="GET",body?:unknown,status=200)=>{
    const response=await h.request(base+path,{method,...(body===undefined?{}:{headers:{"content-type":"application/json"},body:JSON.stringify(body)})});
    assert.equal(response.status,status,await response.clone().text());return response.json();
  };
  const procedure="/branches/sim-main-branch/procedures/sim-procedure";
  await json(procedure+"/draft","PATCH",{name:"HTTP draft",content:"Local HTTP edit",type:"free_form"});
  const before=await json("");
  await json("","PATCH",{procedures:{bad:{procedure_id:"bad",version_id:"missing"}}},404);
  assert.deepEqual(await json(""),before);
  assert.equal((await json(procedure+"/draft")).name,"HTTP draft");
  const result=await json("","PATCH",{version_description:"Published procedure"});
  assert.equal((await json(procedure)).name,"HTTP draft");
  assert.equal((await json(procedure+"?agent_version_id=sim-agent-version-main")).name,"Published support");
  assert.equal((await json(`/versions/${result.version_id}`)).parents.in_branch_parent_id,"sim-agent-version-main");
  assert.equal((await json("/branches")).results.find((b:{id:string})=>b.id==="sim-main-branch").draft_exists,false);
  await json("","PATCH",{procedures:{}});
  await json(procedure,"GET",undefined,404);
});


test("detached candidates share live dependency validation without changing selected configurations", async () => {
  const r=await createScenarioRunner();await r.run(scenarios.startup);
  const a=r.loadContext("/convai/agents"),c=r.loadContext("/convai/agents/{agent_id}/branches");
  const base=c.select("sim-agent",{branch_id:"sim-main-branch"}), before=structuredClone(base);
  const value=a.prepareConfiguration(base,{conversation_config:{agent:{first_message:"Ad hoc"}}})!;
  assert.equal(value.conversation_config.agent!.first_message,"Ad hoc");
  assert.deepEqual(base,before);assert.deepEqual(c.select("sim-agent",{}),before);
  assert.equal(a.prepareConfiguration(base,{conversation_config:{tts:{voice_id:"missing"}}}),undefined);
  const broken=structuredClone(base);broken.procedures!["sim-procedure"].version_id="missing";
  assert.equal(a.prepareConfiguration(broken,{}),undefined);
  const body={conversation_config:{},workflow:{nodes:{start:{type:"start",position:{x:4,y:5}}},edges:{}}};
  const id=a.createAgent(body).value!.agent_id;body.workflow.nodes.start.position.x=999;
  assert.equal(a.getAgent(id)!.workflow!.nodes.start.position.x,4);
});
