import type {GetWhatsAppAccountResponse as Account} from "../../../types/v1/components/schemas/GetWhatsAppAccountResponse.js";
import type {GetConversationResponseModel as Conversation} from "../../../types/v1/components/schemas/GetConversationResponseModel.js";
import type {Context as Agents} from "../agents/_.context.js";
import type {Context as Phones} from "../phone-numbers/_.context.js";
import type {Context as Conversations} from "../conversations/_.context.js";
type Provider="twilio"|"exotel"|"sip_trunk"|"whatsapp";
export type RequestRecord={provider:Provider;kind:"call"|"message"|"registration";target:string;template?:string;language?:string};
const object=(v:unknown):v is Record<string,unknown>=>typeof v==="object"&&v!==null&&!Array.isArray(v);
const text=(v:unknown):v is string=>typeof v==="string"&&!!v.trim();
const number=(v:unknown):v is string=>typeof v==="string"&&/^\+[1-9]\d{6,14}$/.test(v);
export class CommunicationError extends Error {override name="CommunicationError";constructor(public status:number,public code:string){super(code);}}
const fail=(status:number,code:string):never=>{throw new CommunicationError(status,code);};
const invalid=():never=>fail(400,"invalid_communication_request");
export class Context {
 accounts=new Map<string,Account>();
 requests=new Map<string,RequestRecord>();
 nextId=0;
 agents?:()=>Agents;
 phones?:()=>Phones;
 conversations?:()=>Conversations;
 defaults?:{time:number;template:Conversation};
 private account(id:string){return this.accounts.get(id)??fail(404,"whatsapp_account_not_found");}
 private settings(){if(!this.defaults||!this.agents||!this.phones||!this.conversations)throw new Error("Run startup or reset");return this.defaults;}
 get(id:string){const account=structuredClone(this.account(id));account.assigned_agent_name=account.assigned_agent_id?this.agents?.().agents.get(account.assigned_agent_id)?.configuration.name??null:null;return account;}
 list(){return {items:[...this.accounts.keys()].sort().map(id=>this.get(id))};}
 update(id:string,input:unknown){const account=this.account(id);if(!object(input)||Object.keys(input).some(k=>!["assigned_agent_id","enable_messaging","enable_audio_message_response","enable_typing_indicator"].includes(k)))return invalid();
  for(const key of ["enable_messaging","enable_audio_message_response","enable_typing_indicator"])if(input[key]!=null&&typeof input[key]!=="boolean")return invalid();
  if(input.assigned_agent_id!=null&&(!text(input.assigned_agent_id)||!this.agents?.().agents.has(input.assigned_agent_id)))return fail(404,"agent_not_found");
  const next=structuredClone(account);if(Object.hasOwn(input,"assigned_agent_id"))next.assigned_agent_id=input.assigned_agent_id as string|null;
  for(const key of ["enable_messaging","enable_audio_message_response","enable_typing_indicator"]as const)if(input[key]!=null)next[key]=input[key] as boolean;
  this.accounts.set(id,next);return this.get(id);
 }
 remove(id:string){this.account(id);this.accounts.delete(id);return {};}
 private client(agentId:unknown,value:unknown){
  if(!text(agentId))return invalid();const agents=this.agents?.(),record=agents?.agents.get(agentId);if(!record)return fail(404,"agent_not_found");
  if(record.configuration.platform_settings?.archived)return fail(409,"agent_archived");
  if(value!=null&&(!object(value)||Object.keys(value).some(k=>!["user_id","branch_id","environment"].includes(k))))return fail(400,"unsupported_conversation_options");
  const input=(value??{})as Record<string,unknown>;
  for(const key of ["user_id","branch_id","environment"])if(input[key]!=null&&!text(input[key]))return invalid();
  if(input.environment!=null&&input.environment!=="production")return fail(400,"unsupported_conversation_environment");
  if(input.branch_id!=null&&agents?.lifecycle?.get(agentId,input.branch_id as string).is_archived)return fail(409,"branch_archived");
  const configuration=agents?.lifecycle?agents.lifecycle.select(agentId,{branch_id:input.branch_id as string|null|undefined}):structuredClone(record.configuration);
  if(input.branch_id!=null&&!agents?.lifecycle)return fail(404,"branch_not_found");
  return {agent:configuration!,userId:input.user_id as string|null|undefined,environment:(input.environment??"production")as string};
 }
 private create(client:ReturnType<Context["client"]>,request:RequestRecord,textOnly=false){
  const settings=this.settings(),conversations=this.conversations!().conversations;let n=this.nextId,id:string;do{id=`sim-outbound-conversation-${++n}`;}while(conversations.has(id));
  const agent=client.agent,conversation:Conversation={...structuredClone(settings.template),conversation_id:id,agent_id:agent.agent_id,agent_name:agent.name,branch_id:agent.branch_id??null,version_id:agent.version_id??null,user_id:client.userId??null,environment:client.environment,
   metadata:{...structuredClone(settings.template.metadata),start_time_unix_secs:settings.time+n,text_only:textOnly,main_language:agent.conversation_config.agent?.language??"en",conversation_initiation_source:request.provider},status:"initiated"};
  this.requests.set(id,structuredClone(request));conversations.set(id,conversation);this.nextId=n;return id;
 }
 outbound(provider:"twilio"|"exotel"|"sip_trunk",input:unknown){
  if(!object(input)||Object.keys(input).some(k=>!["agent_id","agent_phone_number_id","to_number","conversation_initiation_client_data","call_recording_enabled","telephony_call_config"].includes(k))||!text(input.agent_phone_number_id)||!number(input.to_number))return invalid();
  if(input.call_recording_enabled!=null&&input.call_recording_enabled!==false)return fail(400,"unsupported_call_recording");
  if(input.telephony_call_config!=null){const config=input.telephony_call_config;if(!object(config)||Object.keys(config).some(k=>!["ringing_timeout_secs","twilio_call_recording_enabled","twilio_machine_detection"].includes(k))||config.ringing_timeout_secs!=null&&config.ringing_timeout_secs!==60||config.twilio_call_recording_enabled!=null&&config.twilio_call_recording_enabled!==false||config.twilio_machine_detection!=null)return fail(400,"unsupported_telephony_options");}
  const client=this.client(input.agent_id,input.conversation_initiation_client_data),phone=this.phones?.().phones.get(input.agent_phone_number_id)?.public;
  if(!phone)return fail(404,"phone_number_not_found");if(phone.provider!==provider)return fail(409,"phone_provider_mismatch");if(!phone.supports_outbound||phone.provider==="sip_trunk"&&!phone.outbound_trunk)return fail(409,"phone_outbound_unavailable");
  const id=this.create(client,{provider,kind:"call",target:input.to_number});
  return {success:true,message:"Synthetic call queued; no provider request was made",conversation_id:id,callSid:provider==="sip_trunk"?null:`sim-${provider}-call-${this.nextId}`,sip_call_id:provider==="sip_trunk"?`sim-sip-call-${this.nextId}`:null};
 }
 register(input:unknown){
  if(!object(input)||Object.keys(input).some(k=>!["agent_id","from_number","to_number","direction","conversation_initiation_client_data"].includes(k))||!number(input.from_number)||!number(input.to_number)||input.direction!=null&&!["inbound","outbound"].includes(String(input.direction)))return invalid();
  const client=this.client(input.agent_id,input.conversation_initiation_client_data),outbound=input.direction==="outbound",local=outbound?input.from_number:input.to_number;
  const phone=[...(this.phones?.().phones.values()??[])].find(p=>p.public.phone_number===local)?.public;if(!phone)return fail(404,"phone_number_not_found");if(phone.provider!=="twilio")return fail(409,"phone_provider_mismatch");if(outbound?!phone.supports_outbound:!phone.supports_inbound)return fail(409,"phone_direction_unavailable");
  const id=this.create(client,{provider:"twilio",kind:"registration",target:outbound?input.to_number:input.from_number});
  return `<Response><Connect><Stream url="wss://simulator.invalid/conversations/${id}" /></Connect></Response>`;
 }
 whatsapp(input:unknown,message:boolean){
  if(!object(input)||Object.keys(input).some(k=>!["agent_id","whatsapp_phone_number_id","whatsapp_user_id","conversation_initiation_client_data",...(message?["template_name","template_language_code","template_params"]:["whatsapp_call_permission_request_template_name","whatsapp_call_permission_request_template_language_code"])].includes(k))||!text(input.whatsapp_phone_number_id)||!text(input.whatsapp_user_id))return invalid();
  const template=message?input.template_name:input.whatsapp_call_permission_request_template_name,language=message?input.template_language_code:input.whatsapp_call_permission_request_template_language_code;if(!text(template)||!text(language)||message&&(!Array.isArray(input.template_params)||input.template_params.length))return fail(400,"unsupported_whatsapp_template");
  const client=this.client(input.agent_id,input.conversation_initiation_client_data),account=this.account(input.whatsapp_phone_number_id);
  if(account.is_token_expired)return fail(409,"whatsapp_token_expired");if(account.assigned_agent_id!==client.agent.agent_id)return fail(409,"whatsapp_agent_mismatch");if(message&&account.enable_messaging===false)return fail(409,"whatsapp_messaging_disabled");
  const id=this.create(client,{provider:"whatsapp",kind:message?"message":"call",target:input.whatsapp_user_id,template,language},message);
  return {success:true,message:"Synthetic WhatsApp action queued; no provider request was made",conversation_id:id};
 }
}
