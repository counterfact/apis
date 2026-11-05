import type { Scenario } from "../types/index.js";
export const emptyBatchCalls:Scenario=($)=>{
  const c=$.loadContext("/convai/batch-calling");c.batches=new Map();c.nextId=1;c.nextMutation=0;c.time=1_735_689_610;
  c.agent=id=>$.loadContext("/convai/agents").agents.get(id)?.configuration;
  c.phone=id=>$.loadContext("/convai/phone-numbers").phones.get(id)?.public;
};
export const resetBatchCalls:Scenario=($)=>{
  emptyBatchCalls($);const c=$.loadContext("/convai/batch-calling");
  c.batches=new Map([["sim-batch",{id:"sim-batch",name:'Synthetic "Historical", Batch',agent_id:"sim-agent",agent_name:"Simulator Agent",phone_number_id:"sim-phone-twilio",phone_provider:"twilio",whatsapp_params:null,branch_id:null,branch_name:null,environment:null,timezone:"UTC",created_at_unix:1_735_689_600,scheduled_time_unix:1_735_689_600,last_updated_at_unix:1_735_689_602,status:"completed",retry_count:0,total_calls_scheduled:2,total_calls_dispatched:2,total_calls_finished:2,target_concurrency_limit:null,telephony_call_config:{ringing_timeout_secs:60,twilio_call_recording_enabled:false},recipients:[
    {id:'sim-recipient-"1,',phone_number:"+12025550101",status:"completed",created_at_unix:1_735_689_600,updated_at_unix:1_735_689_602,conversation_id:"sim-conversation"},
    {id:"sim-recipient-2",phone_number:"+12025550102",status:"failed",created_at_unix:1_735_689_600,updated_at_unix:1_735_689_602,conversation_id:null},
  ]}]]);
};
/** Explicit synthetic completion; no calls or conversations are created. */
export const completeBatchCalls:Scenario=($)=>{
  const c=$.loadContext("/convai/batch-calling");
  for(const b of c.batches.values())if(b.status==="pending"||b.status==="in_progress"){
    const time=c.time+ ++c.nextMutation;
    for(const r of b.recipients)if(["pending","dispatched","initiated","in_progress"].includes(r.status)){r.status="completed";r.updated_at_unix=time;}
    b.status="completed";b.last_updated_at_unix=time;b.total_calls_dispatched=b.recipients.filter(r=>["completed","failed","voicemail"].includes(r.status)).length;b.total_calls_finished=b.recipients.length;
  }
};
