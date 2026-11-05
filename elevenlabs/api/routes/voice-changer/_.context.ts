import type { Context as Root } from "../_.context.js";
import type { Context as History } from "../history/_.context.js";
import {object,fail,sourceDuration} from "../audio-isolation/_.context.js";
export class Context {
 audio=new Uint8Array();nextRequest=0;root?:()=>Root;history?:()=>History;
 defaults?:{time:number;model:string;format:string;chargePerSecond:number};
 change(voiceId:string,input:unknown,query:Record<string,unknown>={}){
  if(!object(input)||Object.keys(input).some(k=>!["audio","model_id","voice_settings","seed","remove_background_noise","file_format"].includes(k)))return fail(400,"invalid_voice_change_request");
  if(input.file_format!=null&&input.file_format!=="other"||input.voice_settings!=null||input.seed!=null||input.remove_background_noise!=null&&input.remove_background_noise!==false)return fail(400,"unsupported_voice_change_option");
  if(Object.keys(query).some(k=>!["output_format","enable_logging","optimize_streaming_latency"].includes(k))||query.enable_logging!=null&&typeof query.enable_logging!=="boolean")return fail(400,"invalid_voice_change_request");
  const duration=sourceDuration(input.audio),d=this.defaults;
  if(!d||!this.root||!this.history||!this.audio.length)throw new Error("Run startup or reset");
  if(query.output_format!=null&&query.output_format!==d.format||query.optimize_streaming_latency!=null&&query.optimize_streaming_latency!==0)return fail(400,"unsupported_voice_change_option");
  const root=this.root(),voice=root.voices.get(voiceId)??fail(404,"voice_not_found"),modelId=input.model_id??d.model;
  if(typeof modelId!=="string")return fail(400,"invalid_voice_change_request");
  const model=root.models.get(modelId)??fail(404,"model_not_found");if(!model.can_do_voice_conversion)return fail(400,"model_cannot_convert_voice");
  const account=root.account;if(!account)throw new Error("Run startup or reset");
  const from=account.subscription.character_count,to=from+Math.ceil(duration*d.chargePerSecond);if(to>account.subscription.character_limit)return fail(429,"character_quota_exceeded");
  const history=this.history();let n=this.nextRequest,id:string,requestId:string;do{n++;id=`sim-sts-history-${n}`;requestId=`sim-sts-request-${n}`;}while(history.history.has(id)||[...history.history.values()].some(h=>h.request_id===requestId));
  if(query.enable_logging!==false){history.history.set(id,{history_item_id:id,request_id:requestId,voice_id:voiceId,voice_name:voice.name,voice_category:voice.category as "generated",model_id:modelId,text:null,date_unix:d.time+n,character_count_change_from:from,character_count_change_to:to,content_type:"audio/mpeg",output_format:d.format,state:"created",source:"STS",settings:structuredClone(voice.settings??{})});history.audio.set(id,new Uint8Array(this.audio));}
  account.subscription.character_count=to;this.nextRequest=n;
  return {audio:new Uint8Array(this.audio),requestId,historyId:query.enable_logging!==false?id:undefined};
 }
}
