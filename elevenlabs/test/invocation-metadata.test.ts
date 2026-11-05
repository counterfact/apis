import assert from "node:assert/strict";
import test from "node:test";
import { createScenarioRunner } from "../test-support/scenarios.js";
import { createDispatcherHarness } from "../test-support/dispatcher.js";
import * as scenarios from "../api/scenarios/index.js";

test("invocation context persists names and null restores generated title without changing history",async()=>{
 const r=await createScenarioRunner();await r.run(scenarios.startup);await r.run(scenarios.testInvocationUsage);const c=r.loadContext("/convai/test-invocations");
 const before=c.get("sim-test-invocation"),prices=structuredClone(c.records.get(before.id)!.finalRunPrices),clock=c.mutationTime;
 const changed=c.update(before.id,{name:"Review greeting checks"});assert.equal(changed.name,"Review greeting checks");assert.equal(c.list({search:"Review greeting checks"}).results[0].id,before.id);
 changed.test_runs[0].status="cancelled";assert.deepEqual(c.get(before.id).test_runs,before.test_runs);assert.deepEqual(c.records.get(before.id)!.finalRunPrices,prices);assert.equal(c.mutationTime,clock);
 c.update(before.id,{name:null});assert.equal(c.get(before.id).name,null);assert.equal(c.list().results.find(x=>x.id===before.id)!.title,"Greeting checks");
 for(const input of [{},null,{name:42},{name:" "},{name:"x".repeat(141)},{name:"Invalid",extra:true}])assert.throws(()=>c.update(before.id,input),{status:400});assert.equal(c.get(before.id).name,null);
 assert.throws(()=>c.update("missing",{name:"Unknown"}),{status:404});
 r.loadContext("/convai/agents").deleteAgent("sim-agent");r.loadContext("/convai/agent-testing").delete("sim-test-llm");assert.equal(c.update(before.id,{name:"Historical"}).name,"Historical");assert.deepEqual(c.get(before.id).test_runs,before.test_runs);
 await r.run(scenarios.reset);assert.equal(c.get(before.id).name,"Greeting checks");
});

test("validated Dispatcher updates invocation metadata with errors, isolation and reset",async()=>{
 const h=await createDispatcherHarness(),path="/v1/convai/test-invocations/sim-test-invocation";
 const patch=async(value:unknown,status=200)=>{const response=await h.request(path,{method:"PATCH",headers:{"content-type":"application/json"},body:JSON.stringify(value)});assert.equal(response.status,status,await response.clone().text());return response;};
 const before=await(await h.request(path)).json();const result=await(await patch({name:"HTTP review"})).json();assert.equal(result.name,"HTTP review");assert.deepEqual(result.test_runs,before.test_runs);assert.match((await h.request(path)).headers.get("content-type")!,/application\/json/);
 assert.equal((await(await h.request("/v1/convai/test-invocations?search=HTTP%20review")).json()).results[0].id,before.id);
 await patch({name:null});assert.equal((await(await h.request(path)).json()).name,null);await patch({name:" "},400);await patch({name:12},400);
 const missing=await h.request(path+"-missing",{method:"PATCH",headers:{"content-type":"application/json"},body:JSON.stringify({name:"Missing"})});assert.equal(missing.status,404);
 const other=await createDispatcherHarness();assert.equal((await(await other.request(path)).json()).name,"Greeting checks");await h.scenario("reset");assert.equal((await(await h.request(path)).json()).name,"Greeting checks");
});
