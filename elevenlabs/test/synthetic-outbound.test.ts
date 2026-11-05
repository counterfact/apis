import assert from "node:assert/strict";
import test from "node:test";
import {createScenarioRunner} from "../test-support/scenarios.js";
import {createDispatcherHarness} from "../test-support/dispatcher.js";
import * as scenarios from "../api/scenarios/index.js";
const phone={agent_id:"sim-agent",agent_phone_number_id:"sim-phone-twilio",to_number:"+15005550003"};
const wa={agent_id:"sim-agent",whatsapp_phone_number_id:"sim-whatsapp",whatsapp_user_id:"sim-contact"};
const call={...wa,whatsapp_call_permission_request_template_name:"permission",whatsapp_call_permission_request_template_language_code:"en"};
const message={...wa,template_name:"hello",template_language_code:"en",template_params:[]};
test("communication context updates WhatsApp assignments and creates isolated synthetic conversation state",async()=>{
 const r=await createScenarioRunner();await r.run(scenarios.startup);const c=r.loadContext("/convai/whatsapp-accounts");
 assert.equal(c.list().items.length,1);assert.equal(c.get("sim-whatsapp").assigned_agent_name,"Simulator Support");
 c.update("sim-whatsapp",{enable_typing_indicator:false,enable_messaging:null});assert.equal(c.get("sim-whatsapp").enable_typing_indicator,false);assert.equal(c.get("sim-whatsapp").enable_messaging,true);
 c.update("sim-whatsapp",{assigned_agent_id:null});assert.equal(c.get("sim-whatsapp").assigned_agent_name,null);c.update("sim-whatsapp",{assigned_agent_id:"sim-agent"});
 const result=c.outbound("twilio",phone);assert.equal(result.success,true);const conv=r.loadContext("/convai/conversations").getConversation(result.conversation_id!);assert.equal(conv.status,"initiated");assert.equal(conv.agent_id,"sim-agent");assert.equal(conv.has_audio,false);
 assert.equal(r.loadContext("/convai/conversations").liveCount().count,1);assert.equal(c.requests.get(result.conversation_id!)!.provider,"twilio");
 const copy=c.get("sim-whatsapp");copy.phone_number_name="changed";assert.notEqual(c.get("sim-whatsapp").phone_number_name,"changed");
 await r.run(scenarios.completeSyntheticOutbound);assert.equal(r.loadContext("/convai/conversations").getConversation(result.conversation_id!).status,"done");assert.equal(r.loadContext("/convai/conversations").liveCount().count,0);
 c.remove("sim-whatsapp");assert.equal(c.list().items.length,0);assert.equal(r.loadContext("/convai/conversations").getConversation(result.conversation_id!).status,"done");await r.run(scenarios.reset);assert.equal(c.requests.size,0);assert.equal(c.list().items.length,1);
});
test("communication context rejects invalid/unsupported options atomically and preserves histories",async()=>{
 const r=await createScenarioRunner();await r.run(scenarios.startup);const c=r.loadContext("/convai/whatsapp-accounts");const before=structuredClone([...r.loadContext("/convai/conversations").conversations]);
 for(const [provider,body,status]of [["twilio",{...phone,to_number:"bad"},400],["exotel",phone,409],["sip_trunk",{...phone,agent_phone_number_id:"sim-phone-sip"},409],["twilio",{...phone,agent_id:"missing"},404],["twilio",{...phone,call_recording_enabled:true},400],["twilio",{...phone,conversation_initiation_client_data:{dynamic_variables:{secret:"no"}}},400]]as const)assert.throws(()=>c.outbound(provider,body),{status});
 assert.deepEqual([...r.loadContext("/convai/conversations").conversations],before);assert.equal(c.nextId,0);
 assert.throws(()=>c.update("sim-whatsapp",{assigned_agent_id:"missing"}),{status:404});assert.equal(c.get("sim-whatsapp").assigned_agent_id,"sim-agent");
 c.update("sim-whatsapp",{enable_messaging:false});assert.throws(()=>c.whatsapp(message,true),{status:409});c.update("sim-whatsapp",{enable_messaging:true});
 const created=c.whatsapp(message,true);assert.equal(r.loadContext("/convai/conversations").getConversation(created.conversation_id!).metadata.text_only,true);
 r.loadContext("/convai/agents").deleteAgent("sim-agent");assert.equal(c.get("sim-whatsapp").assigned_agent_name,null);assert.throws(()=>c.whatsapp(call,false),{status:404});assert.equal(r.loadContext("/convai/conversations").getConversation(created.conversation_id!).status,"initiated");
});
test("communication context selects immutable branches, enforces account availability and captures request copies",async()=>{
 const r=await createScenarioRunner();await r.run(scenarios.startup);const c=r.loadContext("/convai/whatsapp-accounts"),agents=r.loadContext("/convai/agents"),conversations=r.loadContext("/convai/conversations");
 const result=c.outbound("twilio",{...phone,conversation_initiation_client_data:{branch_id:"sim-agent-feature",user_id:"sim-customer",environment:"production"}});
 const conversation=conversations.getConversation(result.conversation_id!);assert.equal(conversation.branch_id,"sim-agent-feature");assert.equal(conversation.version_id,"sim-agent-version-feature");assert.equal(conversation.user_id,"sim-customer");
 agents.agents.get("sim-agent")!.configuration.name="Renamed support";assert.equal(c.get("sim-whatsapp").assigned_agent_name,"Renamed support");assert.notEqual(conversations.getConversation(result.conversation_id!).agent_name,"Renamed support");
 const before=c.nextId;assert.throws(()=>c.outbound("twilio",{...phone,conversation_initiation_client_data:{branch_id:"missing"}}),{status:404});
 agents.lifecycle!.update("sim-agent","sim-agent-feature",{is_archived:true});assert.throws(()=>c.outbound("twilio",{...phone,conversation_initiation_client_data:{branch_id:"sim-agent-feature"}}),{code:"branch_archived"});assert.equal(c.nextId,before);
 c.accounts.get("sim-whatsapp")!.is_token_expired=true;assert.throws(()=>c.whatsapp(call,false),{code:"whatsapp_token_expired"});c.accounts.get("sim-whatsapp")!.is_token_expired=false;
 agents.agents.get("sim-agent")!.configuration.platform_settings!.archived=true;assert.throws(()=>c.outbound("twilio",phone),{code:"agent_archived"});assert.equal(c.nextId,before);
});
test("validated Dispatcher supports all ten communication methods and observable reset/isolation",async()=>{
 const h=await createDispatcherHarness();const send=async(path:string,method="GET",body?:unknown,status=200)=>{const res=await h.request(`/v1/convai/${path}`,{method,...(body===undefined?{}:{headers:{"content-type":"application/json"},body:JSON.stringify(body)})});assert.equal(res.status,status,await res.clone().text());return res;};
 assert.equal((await(await send("whatsapp-accounts")).json()).items.length,1);await send("whatsapp-accounts/sim-whatsapp","PATCH",{enable_audio_message_response:false});assert.equal((await(await send("whatsapp-accounts/sim-whatsapp")).json()).enable_audio_message_response,false);
 const twilio=await(await send("twilio/outbound-call","POST",phone)).json();assert.equal((await(await send(`conversations/${twilio.conversation_id}`)).json()).status,"initiated");
 const selected=await(await send("twilio/outbound-call","POST",{...phone,conversation_initiation_client_data:{branch_id:"sim-agent-feature"}})).json();const selectedConversation=await(await send(`conversations/${selected.conversation_id}`)).json();assert.equal(selectedConversation.branch_id,"sim-agent-feature");assert.equal(selectedConversation.version_id,"sim-agent-version-feature");await send("agents/sim-agent/branches/sim-agent-feature","PATCH",{is_archived:true});await send("twilio/outbound-call","POST",{...phone,conversation_initiation_client_data:{branch_id:"sim-agent-feature"}},409);
 const xml=await send("twilio/register-call","POST",{agent_id:"sim-agent",from_number:"+15005550003",to_number:"+15005550001"});assert.match(xml.headers.get("content-type")!,/text\/html/);assert.match(await xml.text(),/<Response>.*wss:\/\/simulator.invalid/);
 await h.scenario("syntheticOutboundProviders");await send("exotel/outbound-call","POST",{...phone,agent_phone_number_id:"sim-phone-exotel"});await send("sip-trunk/outbound-call","POST",{...phone,agent_phone_number_id:"sim-phone-sip"});await send("whatsapp/outbound-call","POST",call);const msg=await(await send("whatsapp/outbound-message","POST",message)).json();assert.equal((await(await send(`conversations/${msg.conversation_id}`)).json()).metadata.text_only,true);
 await send("twilio/outbound-call","POST",{...phone,to_number:"bad"},400);await send("whatsapp-accounts/sim-whatsapp","PATCH",{assigned_agent_id:"missing"},404);await send("whatsapp-accounts/sim-whatsapp","DELETE");await send("whatsapp-accounts/sim-whatsapp","GET",undefined,404);await send("whatsapp/outbound-message","POST",message,404);
 const other=await createDispatcherHarness();assert.equal((await(await other.request("/v1/convai/analytics/live-count")).json()).count,0);await h.scenario("reset");assert.equal((await(await send("whatsapp-accounts")).json()).items.length,1);assert.equal((await(await send("analytics/live-count")).json()).count,0);
});
