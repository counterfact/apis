import type { Context as Root } from "../_.context.js";
import type { Context as History } from "../history/_.context.js";
import type { AudioWithTimestampsAndVoiceSegmentsResponseModel as Payload } from "../../types/v1/components/schemas/AudioWithTimestampsAndVoiceSegmentsResponseModel.js";
import type { DialogueInput } from "../../types/v1/components/schemas/DialogueInput.js";
const object=(v:unknown):v is Record<string,unknown>=>v!==null&&typeof v==="object"&&!Array.isArray(v);
export class RenderingError extends Error {override name="RenderingError";constructor(public status:number,public code:string){super(code);}}
const fail=(status:number,code:string):never=>{throw new RenderingError(status,code);};
const invalid=():never=>fail(400,"invalid_speech_request");
export class Context {
 audio=new Uint8Array();
 nextRender=0;
 root?:()=>Root;
 history?:()=>History;
 defaults?:{time:number;duration:number;maxCharacters:number;ttsModel:string;dialogueModel:string;format:string};
 private settings(){if(!this.defaults||!this.root||!this.history||!this.audio.length)throw new Error("Run startup or reset");return this.defaults;}
 private options(input:Record<string,unknown>,query:Record<string,unknown>,dialogue:boolean){
  const noops=["language_code","voice_settings","settings","pronunciation_dictionary_locators","seed","previous_text","next_text","future_text","previous_request_ids","next_request_ids","use_pvc_as_ivc","apply_text_normalization","apply_language_text_normalization","audio_effects"];
  if(Object.keys(input).some(k=>![dialogue?"inputs":"text","model_id",...noops].includes(k)))return invalid();
  for(const key of noops){const value=input[key];if(value==null)continue;if(key==="apply_text_normalization"&&value==="auto"||["use_pvc_as_ivc","apply_language_text_normalization"].includes(key)&&value===false||["pronunciation_dictionary_locators","previous_request_ids","next_request_ids"].includes(key)&&Array.isArray(value)&&value.length===0)continue;return fail(400,"unsupported_speech_option");}
  if(Object.keys(query).some(k=>!["output_format","enable_logging","optimize_streaming_latency"].includes(k))||query.enable_logging!=null&&typeof query.enable_logging!=="boolean")return invalid();
  const settings=this.settings();if(query.output_format!=null&&query.output_format!==settings.format)return fail(400,"unsupported_speech_output_format");
  if(query.optimize_streaming_latency!=null&&query.optimize_streaming_latency!==0&&query.optimize_streaming_latency!=="0")return fail(400,"unsupported_speech_latency");
  return query.enable_logging!==false;
 }
 speech(voiceId:string,input:unknown,query:Record<string,unknown>={}){
  if(!object(input)||typeof input.text!=="string")return invalid();
  return this.render([{voice_id:voiceId,text:input.text}],input,query,false);
 }
 dialogue(input:unknown,query:Record<string,unknown>={}){
  if(!object(input)||!Array.isArray(input.inputs)||!input.inputs.length||input.inputs.length>100)return invalid();
  const lines=input.inputs.map(value=>{if(!object(value)||Object.keys(value).some(k=>!["voice_id","text"].includes(k))||typeof value.voice_id!=="string"||typeof value.text!=="string")return invalid();return {voice_id:value.voice_id,text:value.text};});
  if(new Set(lines.map(x=>x.voice_id)).size>10)return invalid();return this.render(lines,input,query,true);
 }
 private render(lines:DialogueInput[],input:Record<string,unknown>,query:Record<string,unknown>,dialogue:boolean){
  const retain=this.options(input,query,dialogue),settings=this.settings(),root=this.root!(),history=this.history!();
  const characters=lines.flatMap(line=>Array.from(line.text));
  if(lines.some(line=>!line.text.trim())||characters.length>settings.maxCharacters)return invalid();
  const voices=lines.map(line=>root.voices.get(line.voice_id)??fail(404,"voice_not_found"));
  const modelId=input.model_id??(dialogue?settings.dialogueModel:settings.ttsModel);if(typeof modelId!=="string")return invalid();
  const model=root.models.get(modelId)??fail(404,"model_not_found");if(!model.can_do_text_to_speech)return fail(400,"model_cannot_render_speech");
  if(characters.length>model.maximum_text_length_per_request)return invalid();
  const account=root.account;if(!account)throw new Error("Run startup or reset");
  const from=account.subscription.character_count,to=from+characters.length;if(to>account.subscription.character_limit)return fail(429,"character_quota_exceeded");
  let n=this.nextRender,requestId:string,historyId:string;do{n++;requestId=`sim-speech-request-${n}`;historyId=`sim-speech-history-${n}`;}while(history.history.has(historyId)||[...history.history.values()].some(h=>h.request_id===requestId));
  const alignment={characters,character_start_times_seconds:characters.map((_,i)=>settings.duration*i/characters.length),character_end_times_seconds:characters.map((_,i)=>settings.duration*(i+1)/characters.length)};
  let offset=0;const segments=lines.map((line,index)=>{const start=offset;offset+=Array.from(line.text).length;return {voice_id:line.voice_id,dialogue_input_index:index,character_start_index:start,character_end_index:offset,start_time_seconds:settings.duration*start/characters.length,end_time_seconds:settings.duration*offset/characters.length};});
  const payload:Payload={audio_base64:Buffer.from(this.audio).toString("base64"),alignment:structuredClone(alignment),normalized_alignment:structuredClone(alignment),voice_segments:segments};
  if(retain){history.history.set(historyId,{history_item_id:historyId,request_id:requestId,voice_id:dialogue?null:voices[0]!.voice_id,voice_name:dialogue?null:voices[0]!.name,voice_category:dialogue?null:voices[0]!.category as "generated",model_id:modelId,text:dialogue?null:lines[0]!.text,dialogue:dialogue?lines.map((line,i)=>({...line,voice_name:voices[i]!.name})):null,date_unix:settings.time+n,character_count_change_from:from,character_count_change_to:to,content_type:"audio/mpeg",output_format:settings.format,state:"created",source:"TTS",settings:dialogue?{}:structuredClone(voices[0]!.settings??{}),alignments:{alignment:structuredClone(alignment),normalized_alignment:structuredClone(alignment)}});history.audio.set(historyId,new Uint8Array(this.audio));}
  account.subscription.character_count=to;this.nextRender=n;
  return {audio:new Uint8Array(this.audio),payload,requestId,historyId:retain?historyId:undefined};
 }
}
