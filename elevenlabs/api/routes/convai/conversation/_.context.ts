import type {Context as Agents} from "../agents/_.context.js";
import type {GetAgentResponseModel as Agent} from "../../../types/v1/components/schemas/GetAgentResponseModel.js";
import type {OpenAISessionConfig_Output as Session} from "../../../types/v1/components/schemas/OpenAISessionConfig-Output.js";
export type IssuedCredential={kind:string;createdAt:number;expiresAt:number;configuration?:Agent;conversationId?:string;participantName?:string;tokenType?:string;session?:Session};
const object=(v:unknown):v is Record<string,unknown>=>typeof v==="object"&&v!==null&&!Array.isArray(v);
const text=(v:unknown):v is string=>typeof v==="string"&&!!v.trim();
export class CredentialError extends Error{override name="CredentialError";constructor(public status:number,public code:string){super(code);}}
const fail=(status:number,code:string):never=>{throw new CredentialError(status,code);};
const invalid=():never=>fail(400,"invalid_credential_request");
export class Context{
 issued=new Map<string,IssuedCredential>();
 nextId=0;
 agents?:()=>Agents;
 defaults?:{time:number;signedTtl:number;webrtcTtl:number;singleUseTtl:number;clientSecretTtl:number;session:Session};
 private settings(){if(!this.defaults)throw new Error("Run startup or reset");return this.defaults;}
 private select(input:unknown,token:boolean){
  if(!object(input)||Object.keys(input).some(k=>!["agent_id","branch_id","version_id","environment","debug_events_request",...(token?["participant_name"]:["include_conversation_id"])].includes(k))||!text(input.agent_id))return invalid();
  for(const key of ["branch_id","version_id","environment","participant_name"])if(input[key]!=null&&!text(input[key]))return invalid();
  for(const key of ["debug_events_request","include_conversation_id"])if(input[key]!=null&&typeof input[key]!=="boolean")return invalid();
  if(input.branch_id!=null&&input.version_id!=null)return invalid();
  if(input.environment!=null&&input.environment!=="production")return fail(400,"unsupported_credential_environment");
  if(input.debug_events_request===true)return fail(400,"unsupported_debug_credentials");
  const agents=this.agents?.(),record=agents?.agents.get(input.agent_id);if(!record)return fail(404,"agent_not_found");
  if(record.configuration.platform_settings?.archived)return fail(409,"agent_archived");
  if(input.branch_id!=null&&agents?.lifecycle?.get(input.agent_id,input.branch_id as string).is_archived)return fail(409,"branch_archived");
  if(!agents?.lifecycle&&(input.branch_id!=null||input.version_id!=null))return fail(404,"version_not_found");
  const configuration=agents?.lifecycle?agents.lifecycle.select(input.agent_id,{branch_id:input.branch_id as string|null|undefined,version_id:input.version_id as string|null|undefined}):structuredClone(record.configuration);
  if(configuration.branch_id&&agents?.lifecycle?.get(input.agent_id,configuration.branch_id).is_archived)return fail(409,"branch_archived");
  return {input,configuration};
 }
 private issue(kind:string,ttl:number,extra:Omit<IssuedCredential,"kind"|"createdAt"|"expiresAt">={}){
  const settings=this.settings();let n=this.nextId,key:string;do{key=`sim-${kind}-${++n}`;}while(this.issued.has(key));
  const record:IssuedCredential={kind,createdAt:settings.time,expiresAt:settings.time+ttl,...structuredClone(extra)};
  this.issued.set(key,record);this.nextId=n;return {key,record,n};
 }
 signedUrl(input:unknown){
  const selected=this.select(input,false),settings=this.settings(),n=this.nextId+1;
  const conversationId=selected.input.include_conversation_id===true?`sim-credential-conversation-${n}`:undefined;
  const issued=this.issue("signed",settings.signedTtl,{configuration:selected.configuration,...(conversationId?{conversationId}:{})});
  const url=new URL("wss://simulator.invalid/convai/conversation");url.searchParams.set("agent_id",selected.configuration.agent_id);url.searchParams.set("signature",issued.key);url.searchParams.set("expires_at",String(issued.record.expiresAt));url.searchParams.set("environment","production");
  if(selected.configuration.branch_id)url.searchParams.set("branch_id",selected.configuration.branch_id);if(selected.configuration.version_id)url.searchParams.set("version_id",selected.configuration.version_id);if(conversationId)url.searchParams.set("conversation_id",conversationId);
  return {signed_url:url.href};
 }
 conversationToken(input:unknown){
  const selected=this.select(input,true),settings=this.settings(),conversationId=`sim-credential-conversation-${this.nextId+1}`;
  const issued=this.issue("webrtc",settings.webrtcTtl,{configuration:selected.configuration,conversationId,...(selected.input.participant_name!=null?{participantName:selected.input.participant_name as string}:{})});
  return {token:issued.key,conversation_id:conversationId};
 }
 singleUse(type:unknown){if(typeof type!=="string"||!["realtime_scribe","batch_scribe","tts_websocket"].includes(type))return invalid();return {token:this.issue("single-use",this.settings().singleUseTtl,{tokenType:type}).key};}
 clientSecret(input:unknown){
  if(input==null)input={};if(!object(input)||Object.keys(input).some(k=>!["session","expires_after"].includes(k)))return invalid();
  const settings=this.settings();let ttl=settings.clientSecretTtl;
  if(input.expires_after!=null){const expiry=input.expires_after;if(!object(expiry)||Object.keys(expiry).some(k=>!["anchor","seconds"].includes(k))||expiry.anchor!=null&&expiry.anchor!=="created_at"||typeof expiry.seconds!=="number"||!Number.isSafeInteger(expiry.seconds)||expiry.seconds<1||expiry.seconds>3600)return invalid();ttl=expiry.seconds;}
  const session:Session=structuredClone(settings.session);
  if(input.session!=null){const value=input.session;if(!object(value)||Object.keys(value).some(k=>!["type","model","instructions","output_modalities","temperature","max_response_output_tokens","max_duration_seconds"].includes(k)))return fail(400,"unsupported_realtime_session_options");
   if(Object.values(value).some(v=>v===null))return invalid();
   if(value.type!=null&&value.type!=="realtime"||value.model!=null&&!["eleven_realtime_v1_mini","eleven_realtime_v1_max"].includes(String(value.model))||value.instructions!=null&&typeof value.instructions!=="string"||value.output_modalities!=null&&(!Array.isArray(value.output_modalities)||!value.output_modalities.length||value.output_modalities.some(x=>!["text","audio"].includes(x))||new Set(value.output_modalities).size!==value.output_modalities.length)||value.temperature!=null&&(typeof value.temperature!=="number"||!Number.isFinite(value.temperature)||value.temperature<0||value.temperature>2)||value.max_response_output_tokens!=null&&value.max_response_output_tokens!=="inf"&&(typeof value.max_response_output_tokens!=="number"||!Number.isSafeInteger(value.max_response_output_tokens)||value.max_response_output_tokens<1)||value.max_duration_seconds!=null&&(typeof value.max_duration_seconds!=="number"||!Number.isSafeInteger(value.max_duration_seconds)||value.max_duration_seconds<1||value.max_duration_seconds>3600))return invalid();
   Object.assign(session,structuredClone(value));
  }
  const issued=this.issue("client-secret",ttl,{session});return {value:issued.key,expires_at:issued.record.expiresAt,session:structuredClone(session)};
 }
}
