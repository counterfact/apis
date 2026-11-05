import type { BatchCallDetailedResponse as Batch } from "../../../types/v1/components/schemas/BatchCallDetailedResponse.js";
import type { BatchCallResponse } from "../../../types/v1/components/schemas/BatchCallResponse.js";
const object=(v:unknown):v is Record<string,unknown>=>!!v&&typeof v==="object"&&!Array.isArray(v);
const text=(v:unknown):v is string=>typeof v==="string"&&!!v.trim();
export class BatchError extends Error {
  override name="BatchError";
  constructor(public status:number,public code:string,message:string){super(message);}
}
const invalid=():never=>{throw new BatchError(400,"invalid_batch_request","Invalid or unsupported local batch request");};
export class Context {
  batches=new Map<string,Batch>();
  nextId=1;
  nextMutation=0;
  time=0;
  agent:(id:string)=>{name:string}|undefined=()=>undefined;
  phone:(id:string)=>{provider:"twilio"|"exotel"|"sip_trunk";supports_outbound?:boolean}|undefined=()=>undefined;
  private stored(id:string){const b=this.batches.get(id);if(!b)throw new BatchError(404,"batch_not_found","Batch call not found");return b;}
  private summary(b:Batch):BatchCallResponse{const {recipients:_,...value}=b;return structuredClone(value);}
  getBatch(id:string){return structuredClone(this.stored(id));}
  listBatches(query:Record<string,unknown>={}){
    const size=query.limit??100;if(typeof size!=="number"||!Number.isSafeInteger(size)||size<1||size>1000||query.agent_id!=null&&typeof query.agent_id!=="string"||query.last_doc!=null&&typeof query.last_doc!=="string")return invalid();
    const values=[...this.batches.values()].filter(b=>query.agent_id==null||b.agent_id===query.agent_id).sort((a,b)=>b.created_at_unix-a.created_at_unix||a.id.localeCompare(b.id));
    const cursor=query.last_doc==null?-1:values.findIndex(b=>b.id===query.last_doc);if(query.last_doc!=null&&cursor<0)return invalid();
    const page=values.slice(cursor+1,cursor+1+size),has_more=cursor+1+size<values.length;
    return {batch_calls:page.map(b=>this.summary(b)),has_more,next_doc:has_more?page.at(-1)!.id:null};
  }
  submitBatch(input:unknown){
    if(!object(input)||Object.keys(input).some(k=>!["call_name","agent_id","recipients","scheduled_time_unix","agent_phone_number_id","whatsapp_params","timezone","branch_id","environment","telephony_call_config","target_concurrency_limit"].includes(k))||!text(input.call_name)||!text(input.agent_id)||!Array.isArray(input.recipients)||!input.recipients.length||input.recipients.length>10000)return invalid();
    if(input.whatsapp_params!=null||input.branch_id!=null||input.environment!=null)return invalid();
    if(input.timezone!=null&&(typeof input.timezone!=="string"||input.timezone!=="UTC"))return invalid();
    if(input.scheduled_time_unix!=null&&(!Number.isSafeInteger(input.scheduled_time_unix)||(input.scheduled_time_unix as number)<0)||input.target_concurrency_limit!=null&&(!Number.isSafeInteger(input.target_concurrency_limit)||(input.target_concurrency_limit as number)<1))return invalid();
    const agent=this.agent(input.agent_id);if(!agent)throw new BatchError(404,"agent_not_found","Agent not found");
    const phoneId=input.agent_phone_number_id;if(!text(phoneId))return invalid();const phone=this.phone(phoneId);if(!phone)throw new BatchError(404,"phone_not_found","Phone number not found");if(!phone.supports_outbound)return invalid();
    const config=input.telephony_call_config??{};if(!object(config)||Object.keys(config).some(k=>!["ringing_timeout_secs","twilio_call_recording_enabled","twilio_machine_detection"].includes(k))||config.twilio_machine_detection!=null||config.ringing_timeout_secs!=null&&(!Number.isSafeInteger(config.ringing_timeout_secs)||(config.ringing_timeout_secs as number)<1||(config.ringing_timeout_secs as number)>999)||config.twilio_call_recording_enabled!==undefined&&typeof config.twilio_call_recording_enabled!=="boolean")return invalid();
    const seen=new Set<string>();
    for(const r of input.recipients){if(!object(r)||Object.keys(r).some(k=>!["id","phone_number","whatsapp_user_id","conversation_initiation_client_data"].includes(k))||!text(r.phone_number)||!/^\+[1-9]\d{6,14}$/.test(r.phone_number)||r.whatsapp_user_id!=null||r.conversation_initiation_client_data!=null||r.id!=null&&!text(r.id)||typeof r.id==="string"&&seen.has(r.id))return invalid();if(typeof r.id==="string")seen.add(r.id);}
    const n=this.nextId,id=`sim-batch-created-${n}`,time=this.time+this.nextMutation+1;
    const recipients=input.recipients.map((r,i)=>{const v=r as Record<string,unknown>;return {id:v.id as string??`${id}-recipient-${i+1}`,phone_number:v.phone_number as string,whatsapp_user_id:null,status:"pending" as const,created_at_unix:time,updated_at_unix:time,conversation_id:null,conversation_initiation_client_data:null};});
    if(new Set(recipients.map(r=>r.id)).size!==recipients.length)return invalid();
    const batch:Batch={id,name:input.call_name,agent_id:input.agent_id,agent_name:agent.name,phone_number_id:phoneId,phone_provider:phone.provider,whatsapp_params:null,branch_id:null,branch_name:null,environment:null,timezone:input.timezone as string??null,created_at_unix:time,scheduled_time_unix:input.scheduled_time_unix as number??time,last_updated_at_unix:time,status:"pending",retry_count:0,total_calls_scheduled:recipients.length,total_calls_dispatched:0,total_calls_finished:0,target_concurrency_limit:input.target_concurrency_limit as number??null,telephony_call_config:{ringing_timeout_secs:config.ringing_timeout_secs as number??60,twilio_call_recording_enabled:config.twilio_call_recording_enabled as boolean??false},recipients};
    this.nextId++;this.nextMutation++;this.batches.set(id,batch);return this.summary(batch);
  }
  cancelBatch(id:string){const b=this.stored(id);if(b.status==="cancelled")return this.summary(b);if(!["pending","in_progress"].includes(b.status))throw new BatchError(409,"batch_not_running","Batch is already terminal");const time=this.time+ ++this.nextMutation;b.status="cancelled";b.last_updated_at_unix=time;for(const r of b.recipients){r.status="cancelled";r.updated_at_unix=time;}b.total_calls_finished=b.recipients.length;return this.summary(b);}
  retryBatch(id:string){
    const b=this.stored(id);if(!["completed","failed","cancelled"].includes(b.status))throw new BatchError(409,"batch_not_terminal","Only terminal batches can retry");
    const failed=b.recipients.filter(r=>r.status==="failed");if(!failed.length)throw new BatchError(409,"batch_no_retryable_recipients","No failed recipients to retry");
    const agent=this.agent(b.agent_id),phone=b.phone_number_id?this.phone(b.phone_number_id):undefined;if(!agent||!phone?.supports_outbound)throw new BatchError(409,"batch_source_unavailable","Current agent and outbound phone are required to retry");
    const time=this.time+ ++this.nextMutation;for(const r of failed){r.status="pending";r.updated_at_unix=time;r.conversation_id=null;}b.status="pending";b.retry_count++;b.last_updated_at_unix=time;b.total_calls_scheduled=b.recipients.length;b.total_calls_dispatched=b.recipients.filter(r=>["completed","voicemail"].includes(r.status)).length;b.total_calls_finished=b.recipients.filter(r=>["completed","voicemail","cancelled"].includes(r.status)).length;return this.summary(b);
  }
  deleteBatch(id:string){this.stored(id);this.batches.delete(id);}
  exportBatch(id:string,limit?:unknown){
    const b=this.stored(id);if(!["completed","failed","cancelled"].includes(b.status))throw new BatchError(409,"batch_not_terminal","Only terminal batches can export");
    const size=typeof limit==="string"&&/^\d+$/.test(limit)?Number(limit):limit;if(size!=null&&(typeof size!=="number"||!Number.isSafeInteger(size)||size<1))return invalid();
    const csv=(v:unknown)=>`"${String(v??"").replaceAll('"','""')}"`;
    return ["recipient_id,phone_number,status,conversation_id",...b.recipients.slice(0,size as number|undefined).map(r=>[r.id,r.phone_number,r.status,r.conversation_id].map(csv).join(","))].join("\r\n")+"\r\n";
  }
}
