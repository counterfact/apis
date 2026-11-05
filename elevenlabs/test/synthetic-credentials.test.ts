import assert from "node:assert/strict";
import test from "node:test";
import {createScenarioRunner} from "../test-support/scenarios.js";
import {createDispatcherHarness} from "../test-support/dispatcher.js";
import * as scenarios from "../api/scenarios/index.js";

test("credential context records isolated canonical selections and deterministic expiry without starting sessions",async()=>{
 const r=await createScenarioRunner();await r.run(scenarios.startup);const c=r.loadContext("/convai/conversation"),conversations=r.loadContext("/convai/conversations");
 assert.equal(c.issued.size,0);const count=conversations.conversations.size;
 const signed=c.signedUrl({agent_id:"sim-agent",branch_id:"sim-agent-feature",include_conversation_id:true});
 const url=new URL(signed.signed_url);assert.equal(url.hostname,"simulator.invalid");assert.equal(url.searchParams.get("branch_id"),"sim-agent-feature");assert.equal(url.searchParams.get("conversation_id"),"sim-credential-conversation-1");
 const issued=c.issued.get("sim-signed-1")!;assert.equal(issued.configuration!.conversation_config.agent!.first_message,"Feature greeting");assert.equal(issued.expiresAt-issued.createdAt,900);
 issued.configuration!.conversation_config.agent!.first_message="mutated";assert.equal(r.loadContext("/convai/agents").lifecycle!.select("sim-agent",{branch_id:"sim-agent-feature"}).conversation_config.agent!.first_message,"Feature greeting");
 const token=c.conversationToken({agent_id:"sim-agent",version_id:"sim-agent-version-main",participant_name:"Synthetic Participant"});assert.equal(token.conversation_id,"sim-credential-conversation-2");assert.equal(c.issued.get(token.token)!.participantName,"Synthetic Participant");
 assert.equal(c.singleUse("batch_scribe").token,"sim-single-use-3");assert.equal(c.issued.get("sim-single-use-3")!.expiresAt,1735689600+900);
 const secret=c.clientSecret({expires_after:{seconds:120},session:{model:"eleven_realtime_v1_max",instructions:"Synthetic config",output_modalities:["text"]}});assert.equal(secret.expires_at,1735689720);assert.equal(secret.session!.model,"eleven_realtime_v1_max");secret.session!.instructions="mutated";assert.equal(c.issued.get(secret.value)!.session!.instructions,"Synthetic config");
 assert.equal(conversations.conversations.size,count);assert.equal(r.loadContext("/convai/realtime").conversations.size,2);
 await r.run(scenarios.reset);assert.equal(c.issued.size,0);assert.equal(c.singleUse("tts_websocket").token,"sim-single-use-1");
});

test("credential context rejects unsupported selections and invalid secrets before allocation",async()=>{
 const r=await createScenarioRunner();await r.run(scenarios.startup);const c=r.loadContext("/convai/conversation");
 for(const q of [{agent_id:"missing"},{agent_id:"sim-agent",branch_id:"missing"},{agent_id:"sim-agent",branch_id:"sim-agent-feature",version_id:"sim-agent-version-main"},{agent_id:"sim-agent",environment:"staging"},{agent_id:"sim-agent",debug_events_request:true}])assert.throws(()=>c.signedUrl(q));
 assert.throws(()=>c.singleUse("unknown"),{status:400});assert.throws(()=>c.clientSecret({expires_after:{seconds:0}}),{status:400});assert.throws(()=>c.clientSecret({session:{tools:[]}}),{status:400});
 for(const key of ["type","model","instructions","output_modalities","temperature","max_response_output_tokens","max_duration_seconds"])assert.throws(()=>c.clientSecret({session:{[key]:null}}),{status:400});
 assert.equal(c.nextId,0);assert.equal(c.issued.size,0);
 r.loadContext("/convai/agents").lifecycle!.update("sim-agent","sim-agent-feature",{is_archived:true});assert.throws(()=>c.conversationToken({agent_id:"sim-agent",branch_id:"sim-agent-feature"}),{status:409});assert.throws(()=>c.conversationToken({agent_id:"sim-agent",version_id:"sim-agent-version-feature"}),{status:409});
 r.loadContext("/convai/agents").agents.get("sim-agent")!.configuration.platform_settings!.archived=true;assert.throws(()=>c.signedUrl({agent_id:"sim-agent"}),{status:409});assert.equal(c.nextId,0);
});

test("validated Dispatcher issues all five synthetic credential operations with shared aliases and reset",async()=>{
 const h=await createDispatcherHarness();const send=async(path:string,method="GET",body?:unknown,status=200)=>{const res=await h.request(`/v1/${path}`,{method,...(body===undefined?{}:{headers:{"content-type":"application/json"},body:JSON.stringify(body)})});assert.equal(res.status,status,await res.clone().text());return res;};
 const query="agent_id=sim-agent&branch_id=sim-agent-feature&include_conversation_id=true";
 const first=await(await send(`convai/conversation/get-signed-url?${query}`)).json();assert.match(first.signed_url,/signature=sim-signed-1/);assert.match(first.signed_url,/version_id=sim-agent-version-feature/);
 const alias=await(await send(`convai/conversation/get_signed_url?${query}`)).json();assert.match(alias.signed_url,/signature=sim-signed-2/);
 const token=await(await send("convai/conversation/token?agent_id=sim-agent&version_id=sim-agent-version-main")).json();assert.equal(token.token,"sim-webrtc-3");assert.equal(token.conversation_id,"sim-credential-conversation-3");
 const single=await(await send("single-use-token/realtime_scribe","POST")).json();assert.equal(single.token,"sim-single-use-4");
 const secret=await(await send("convai/realtime/client_secrets","POST",{expires_after:{seconds:60},session:{instructions:"Local only"}})).json();assert.equal(secret.value,"sim-client-secret-5");assert.equal(secret.expires_at,1735689660);
 await send("convai/conversation/token?agent_id=missing","GET",undefined,404);await send("convai/conversation/get-signed-url?agent_id=sim-agent&environment=staging","GET",undefined,400);await send("convai/realtime/client_secrets","POST",{session:{tools:[]}},400);
 const other=await createDispatcherHarness();assert.equal((await(await other.request("/v1/single-use-token/tts_websocket",{method:"POST"})).json()).token,"sim-single-use-1");
 await h.scenario("reset");assert.equal((await(await send("single-use-token/batch_scribe","POST")).json()).token,"sim-single-use-1");assert.equal((await(await send("convai/analytics/live-count")).json()).count,0);
});
