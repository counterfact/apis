import type { Scenario } from "../types/index.js";
export const emptyConversations: Scenario = ($) => {
  const context = $.loadContext("/convai/conversations");
  context.conversations = new Map();
  context.audio = new Map();
  context.files = new Map();
  context.smartMatches=new Map();context.analysisFixtures=new Map();context.analysisFixtureVersions=new Map();context.analysisDefinitions=()=>new Map([...$.loadContext("/convai/analysis-items").items].map(([id,r])=>[id,r.item.current_version_id]));context.agents=()=>$.loadContext("/convai/agents").agents;
  $.loadContext("/convai/analytics").conversations=()=>context;
  $.loadContext("/convai/users").conversations = () => context.conversations;
  context.sipMessages = new Map();
  context.references = new Map();
  context.workspaceId = "sim-workspace";
  context.tag = id => $.loadContext("/convai/tags").getTag(id);
};
export const resetConversations: Scenario = ($) => {
  emptyConversations($);
  const context = $.loadContext("/convai/conversations");
  context.conversations = new Map([
    ["sim-conversation", {conversation_id: "sim-conversation", agent_id: "sim-agent", agent_name: "Simulator Support", user_id: "sim-user", status: "done", conversation_product: "agent", environment: "production",
      metadata: {start_time_unix_secs: 1_735_689_602, call_duration_secs: 15, cost: 10, cost_fiat: null, text_only: true, main_language: "en", conversation_initiation_source: "react_sdk", termination_reason: "agent_ended_conversation", feedback: {type: "thumbs", overall_score: null, likes: 0, dislikes: 0}},
      analysis: {call_successful: "success", transcript_summary: "Synthetic support question answered.", call_summary_title: "Synthetic support"},
      has_audio: false, has_user_audio: false, has_response_audio: false, has_auxiliary_audio: false, tag_ids: [],
      transcript: [{role: "user", message: "How can I get help?", time_in_call_secs: 0}, {role: "agent", message: "Here is synthetic support information.", time_in_call_secs: 1}, {role: "agent", message: null, time_in_call_secs: 2}]}],
    ["sim-conversation-old", {conversation_id: "sim-conversation-old", agent_id: "sim-agent-old", agent_name: "Historical Simulator", user_id: "sim-user-old", status: "failed", conversation_product: "agent", environment: "production",
      metadata: {start_time_unix_secs: 1_735_689_600, call_duration_secs: 5, cost_fiat: null, text_only: false, main_language: "es", termination_reason: "synthetic_error"},
      analysis: {call_successful: "failure", transcript_summary: "Synthetic historical failure."},
      has_audio: false, has_user_audio: false, has_response_audio: false, has_auxiliary_audio: false, tag_ids: [], transcript: []}],
  ]);
  context.references = new Map([["sim-agent\nhttps://simulator.zendesk.com/agent/tickets/12345", "sim-conversation"], ["sim-agent\nhttps://simulator.slack.com/archives/C123/p1735689602000000", "sim-conversation"]]);
  // Same independently decoded synthetic MP3 silence as bounded-speech.ts.
  const audio = new Uint8Array(417 * 20);
  for (let n = 0; n < 20; n++) audio.set([255, 251, 144, 100], n * 417);
  context.audio.set("sim-conversation", audio);
  context.conversations.get("sim-conversation")!.has_audio = true;
  context.conversations.get("sim-conversation")!.has_response_audio = true;
  const used = {file_id:"sim-file-used", original_filename:"synthetic-used.txt", mime_type:"text/plain", file_url:"https://example.invalid/synthetic-used.txt"};
  const unused = {file_id:"sim-file-unused", original_filename:"synthetic-unused.txt", mime_type:"text/plain", file_url:"https://example.invalid/synthetic-unused.txt"};
  context.files.set("sim-conversation", new Map([[used.file_id, used], [unused.file_id, unused]]));
  context.conversations.get("sim-conversation")!.transcript[0].file_inputs = [structuredClone(used)];
  context.sipMessages = new Map([["sim-conversation", [
    {call_id: "sim-conversation-call-1", phone_numbers: ["+15005550002"], local_address: "192.0.2.10:5060", remote_address: "198.51.100.10:5060", transport: "udp", raw_message: "INVITE sip:sim@example.invalid SIP/2.0\r\n", error_message: "", direction: "in", created_at_unix_micro: 1_735_689_602_000_000},
    {call_id: "sim-conversation-call-2", phone_numbers: ["+15005550002"], local_address: "192.0.2.10:5060", remote_address: "198.51.100.10:5060", transport: "udp", raw_message: "SIP/2.0 200 OK\r\n", error_message: "", direction: "out", created_at_unix_micro: 1_735_689_603_000_000},
  ]]]);
};

/** Add repeat contacts and an anonymous record without changing baseline records. */
export const conversationUserContacts: Scenario = ($) => {
  const c = $.loadContext("/convai/conversations");
  const base = c.conversations.get("sim-conversation");
  if (!base) throw new Error("Run reset before conversationUserContacts");
  for (const [id, time, branch] of [
    ["sim-conversation-first", 1735689599, undefined],
    ["sim-conversation-latest", 1735689604, "sim-branch"],
  ] as const) {
    const record = structuredClone(base);
    record.conversation_id = id;
    record.metadata.start_time_unix_secs = time;
    record.branch_id = branch;
    c.conversations.set(id, record);
  }
  const anonymous = structuredClone(base);
  anonymous.conversation_id = "sim-conversation-anonymous";
  anonymous.user_id = null;
  c.conversations.set(anonymous.conversation_id, anonymous);
};

export const conversationInsights:Scenario=($)=>{
 const c=$.loadContext("/convai/conversations"),agent=$.loadContext("/convai/agents").agents.get("sim-agent")!;
 agent.configuration.platform_settings??={};agent.configuration.platform_settings.analysis_items={evaluation_criteria:[{source:"user",analysis_item_id:"sim-analysis-evaluation"}],data_collection:[{source:"user",analysis_item_id:"sim-analysis-data"}]};
 c.smartMatches.set("assistance",[{conversationId:"sim-conversation",index:1,text:"Here is synthetic support information.",score:0.9}]);
 c.analysisFixtureVersions=new Map([["sim-analysis-evaluation","sim-analysis-evaluation-v1"],["sim-analysis-data","sim-analysis-data-v1"]]);
 c.analysisFixtures.set("sim-conversation",{call_successful:"success",transcript_summary:"Scenario analysis: support answered.",call_summary_title:"Synthetic analysis",evaluation_criteria_results:{"sim-analysis-evaluation":{criteria_id:"sim-analysis-evaluation",result:"success",rationale:"Explicit synthetic fixture"}},data_collection_results:{"sim-analysis-data":{data_collection_id:"sim-analysis-data",value:"support",rationale:"Explicit synthetic fixture"}}});
 const live=structuredClone(c.conversations.get("sim-conversation")!);live.conversation_id="sim-conversation-live";live.status="in-progress";live.transcript=[];live.analysis=null;c.conversations.set(live.conversation_id,live);
};
