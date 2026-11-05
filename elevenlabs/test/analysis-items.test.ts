import assert from "node:assert/strict";
import test from "node:test";
import { createScenarioRunner } from "../test-support/scenarios.js";
import { createDispatcherHarness } from "../test-support/dispatcher.js";
import * as scenarios from "../api/scenarios/index.js";
const base = "/v1/convai/analysis-items";
const definition = {kind:"evaluation",name:"Greeting",conversation_goal_prompt:"Did the agent greet the user?"};
test("analysis dependencies and attachments follow canonical main-branch replacement", async () => {
  const r = await createScenarioRunner();
  await r.run(scenarios.startup);
  const c = r.loadContext("/convai/analysis-items");
  const agents = r.loadContext("/convai/agents");
  await r.run(scenarios.agentAnalysisReferences);
  const original = agents.agents.get("sim-agent")!;
  Object.assign(original, { mainBranch: { id: "sim-main-branch", name: "Renamed main" } });
  assert.equal(c.dependentAgents("sim-analysis-evaluation").branches![0].branch_name, "Renamed main");
  agents.agents = new Map([["sim-agent", {
    ...original, mainBranch: { id: "replacement-main", name: "Replacement main" },
  }]]);
  assert.equal(c.dependentAgents("sim-analysis-evaluation").branches![0].branch_id, "replacement-main");
  const results = c.updateAttachments("sim-analysis-data", { source: "user", attach: [
    { agent_id: "sim-agent", branch_id: "sim-main-branch" },
    { agent_id: "sim-agent", branch_id: "replacement-main" },
  ] });
  assert.deepEqual(results.results.map(result => result.status), ["failure", "success"]);
  const duplicate = agents.duplicateAgent("sim-agent", {});
  assert.ok(duplicate.value);
  assert.equal(c.dependentAgents("sim-analysis-evaluation").agents.length, 2);
  assert.equal(c.dependentAgents("sim-analysis-evaluation").branches!.length, 1);
  const missingBranch = c.updateAttachments("sim-analysis-data", { source: "user", attach: [
    { agent_id: duplicate.value.agent_id, branch_id: "replacement-main" },
  ] });
  assert.equal(missingBranch.results[0].status, "failure");
  await r.run(scenarios.emptyAnalysisItems);
  const newItem = c.createItem(definition);
  assert.equal(c.updateAttachments(newItem.id, { source: "user", attach: [
    { agent_id: "sim-agent", branch_id: "replacement-main" },
  ] }).results[0].status, "success");
  agents.deleteAgent("sim-agent");
  assert.deepEqual(c.dependentAgents(newItem.id).branches, []);
  await r.run(scenarios.reset);
  await r.run(scenarios.agentAnalysisReferences);
  assert.equal(c.dependentAgents("sim-analysis-evaluation").branches![0].branch_id, "sim-main-branch");
});

test("validated analysis dependencies use canonical branch scenario metadata", async () => {
  const h = await createDispatcherHarness();
  await h.scenario("agentAnalysisReferences");
  await h.scenario("agentMainBranchPreview");
  const dependencies = async () => {
    const response = await h.request(`${base}/sim-analysis-evaluation/dependent-agents`);
    assert.equal(response.status, 200);
    return response.json();
  };
  assert.equal((await dependencies()).branches![0].branch_name, "Preview main");
  const attachment = await h.request(`${base}/sim-analysis-data/attachments`, {
    method: "PATCH", headers: { "content-type": "application/json" },
    body: JSON.stringify({ source: "user", attach: [
      { agent_id: "sim-agent", branch_id: "unknown-main-branch" },
      { agent_id: "sim-agent", branch_id: "sim-main-branch" },
    ] }),
  });
  assert.equal(attachment.status, 200);
  assert.deepEqual((await attachment.json()).results.map((result: {status:string}) => result.status), ["failure", "success"]);
  assert.equal((await h.request("/v1/convai/agents/sim-agent", { method: "DELETE" })).status, 204);
  assert.deepEqual((await dependencies()).branches, []);
  await h.scenario("reset");
  await h.scenario("agentAnalysisReferences");
  assert.equal((await dependencies()).branches![0].branch_name, "main");
});
test("analysis context versions, copies, filters and defensive snapshots", async () => {
  const {Context} = await import("../api/routes/convai/analysis-items/_.context.js");
  assert.equal(new Context().items.size,0);
  const runner = await createScenarioRunner(); await runner.run(scenarios.startup);
  const c = runner.loadContext("/convai/analysis-items");
  const created = c.createItem(definition);
  assert.equal(created.definition.kind,"evaluation");
  created.definition.name="outside";
  assert.equal(c.getItem(created.id).definition.name,"Greeting");
  const unchanged = c.updateItem(created.id,{conversation_goal_prompt:definition.conversation_goal_prompt,name:definition.name,kind:definition.kind});
  assert.equal(unchanged.current_version_id,created.current_version_id);
  const changed = c.updateItem(created.id,{...definition,name:"Changed"});
  assert.notEqual(changed.current_version_id,created.current_version_id);
  assert.equal(c.listVersions(created.id).versions.length,2);
  assert.equal(c.listVersions(created.id).versions[1].definition.name,"Greeting");
  assert.throws(()=>c.updateItem(created.id,{...definition,kind:"data_collection"}));
  assert.equal(c.getItem(created.id).definition.name,"Changed");
  const copy=c.copyItem(created.id); assert.notEqual(copy.id,created.id);
  c.deleteItem(created.id,false); assert.throws(()=>c.getItem(created.id));
  assert.equal(c.getItem(copy.id).definition.name,"Changed");
  assert.equal(c.listItems({kind:"data_collection"}).analysis_items.length,1);
  assert.equal(c.listItems({search:"Simulator"}).analysis_items.length,2);
  assert.throws(()=>c.listItems({page_size:"bad"}));
  assert.throws(()=>c.createItem({...definition,name:" "}));
  await runner.run(scenarios.reset); assert.equal(c.items.size,2); assert.equal(c.nextId,1);
});
test("analysis context attachment batches derive live dependencies and force deletion", async () => {
  const r=await createScenarioRunner(); await r.run(scenarios.startup);
  const c=r.loadContext("/convai/analysis-items"), agents=r.loadContext("/convai/agents");
  const destination={agent_id:"sim-agent",branch_id:"sim-main-branch"};
  const results=c.updateAttachments("sim-analysis-evaluation",{source:"user",attach:[destination,destination,{...destination,branch_id:"unknown"}]});
  assert.deepEqual(results.results.map(v=>v.status),["success","success","failure"]);
  assert.equal(results.results[0].status==="success"&&results.results[0].data.changed,true);
  assert.equal(results.results[1].status==="success"&&results.results[1].data.changed,false);
  assert.equal(c.dependentAgents("sim-analysis-evaluation").agents.length,1);
  const duplicate=agents.duplicateAgent("sim-agent",{name:"Copied"}); assert.ok(duplicate.value);
  assert.equal(c.dependentAgents("sim-analysis-evaluation").agents.length,2);
  assert.throws(()=>c.deleteItem("sim-analysis-evaluation",false));
  c.deleteItem("sim-analysis-evaluation",true);
  for(const record of agents.agents.values()) assert.equal(record.configuration.platform_settings?.analysis_items?.evaluation_criteria?.length,0);
  await r.run(scenarios.reset); assert.equal(c.dependentAgents("sim-analysis-evaluation").agents.length,0);
});
test("validated analysis Dispatcher lifecycle versions attachments isolation and reset", async () => {
  const app=await createDispatcherHarness(), second=await createDispatcherHarness();
  const send=(url:string,method:string,body?:unknown)=>app.request(url,{method,...(body===undefined?{}:{headers:{"Content-Type":"application/json"},body:JSON.stringify(body)})});
  const list=await app.request(`${base}?page_size=1`); assert.equal(list.status,200);
  assert.match(list.headers.get("content-type")!,/json/);
  const page=await list.json(); assert.equal(page.analysis_items.length,1); assert.equal(page.has_more,true);
  assert.equal((await (await app.request(`${base}?cursor=${page.next_cursor}`)).json()).analysis_items.length,1);
  const res=await send(base,"POST",definition); assert.equal(res.status,200); const item=await res.json();
  assert.equal((await app.request(`${base}?analysis_item_ids=${item.id}`)).status,200);
  assert.equal((await (await app.request(`${base}?analysis_item_ids=${item.id}`)).json()).analysis_items.length,1);
  assert.equal((await send(`${base}/${item.id}`,"PATCH",{...definition,name:"Changed"})).status,200);
  assert.equal((await (await app.request(`${base}/${item.id}`)).json()).definition.name,"Changed");
  const beforeReorder=await (await app.request(`${base}/${item.id}`)).json();
  const reordered=await send(`${base}/${item.id}`,"PATCH",{conversation_goal_prompt:definition.conversation_goal_prompt,name:"Changed",kind:"evaluation"});
  assert.equal(reordered.status,200); assert.equal((await reordered.json()).current_version_id,beforeReorder.current_version_id);
  const data=await send(base,"POST",{kind:"data_collection",name:"Requested Topic",value_schema:{type:"string",description:"Topic"}});
  assert.equal(data.status,200); const dataItem=await data.json();
  assert.equal((await (await app.request(`${base}?kind=data_collection&created_by_user_id=@me`)).json()).analysis_items.length,2);
  const dataDestination={agent_id:"sim-agent",branch_id:"sim-main-branch"};
  assert.equal((await send(`${base}/${dataItem.id}/attachments`,"PATCH",{source:"user",attach:[dataDestination]})).status,200);
  assert.equal((await (await app.request(`${base}/${dataItem.id}/dependent-agents`)).json()).branches![0].branch_id,"sim-main-branch");
  const detached=await send(`${base}/${dataItem.id}/attachments`,"PATCH",{source:"user",detach:[dataDestination]});
  assert.equal(detached.status,200); assert.equal((await detached.json()).results[0].data.changed,true);
  assert.equal((await (await app.request(`${base}/${dataItem.id}/dependent-agents`)).json()).agents.length,0);
  const versions=await (await app.request(`${base}/${item.id}/versions?page_size=1`)).json(); assert.equal(versions.versions.length,1); assert.equal(versions.has_more,true);
  const copy=await send(`${base}/${item.id}/copy`,"POST"); assert.equal(copy.status,200); assert.notEqual((await copy.json()).id,item.id);
  const attach=`${base}/${item.id}/attachments`, destination={agent_id:"sim-agent",branch_id:"sim-main-branch"};
  const attached=await send(attach,"PATCH",{source:"user",attach:[destination,{...destination,agent_id:"missing"}]}); assert.equal(attached.status,200);
  assert.deepEqual((await attached.json()).results.map((v:{status:string})=>v.status),["success","failure"]);
  assert.equal((await (await app.request(`${base}/${item.id}/dependent-agents`)).json()).agents[0].id,"sim-agent");
  const agent=await (await app.request("/v1/convai/agents/sim-agent")).json(); assert.equal(agent.platform_settings.analysis_items.evaluation_criteria[0].analysis_item_id,item.id);
  assert.equal((await send(`${base}/${item.id}`,"DELETE")).status,409);
  assert.equal((await send(`${base}/${item.id}?force=true`,"DELETE")).status,200);
  assert.equal((await app.request(`${base}/${item.id}`)).status,404);
  assert.deepEqual((await (await app.request("/v1/convai/agents/sim-agent")).json()).platform_settings.analysis_items.evaluation_criteria,[]);
  assert.equal((await send(base,"POST",{...definition,name:9})).status,400);
  assert.equal((await send(base,"POST",{...definition,name:" "})).status,400);
  assert.equal((await app.request(`${base}?page_size=0`)).status,400);
  assert.equal((await (await second.request(base)).json()).analysis_items.length,2);
  await app.scenario("emptyAnalysisItems","api"); assert.equal((await (await app.request(base)).json()).analysis_items.length,0);
  await app.scenario("reset","api"); assert.equal((await (await app.request(base)).json()).analysis_items.length,2);
});
