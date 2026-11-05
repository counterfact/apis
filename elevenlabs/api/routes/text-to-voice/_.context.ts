import type { Context as Root } from "../_.context.js";
import type { VoiceResponseModel as Voice } from "../../types/v1/components/schemas/VoiceResponseModel.js";
import type { VoicePreviewsResponseModel as Result } from "../../types/v1/components/schemas/VoicePreviewsResponseModel.js";
type Preview={audio:Uint8Array;text:string;description:string;modelId:string;language:string|null;sourceVoiceId?:string;savedVoiceId?:string};
const object=(v:unknown):v is Record<string,unknown>=>v!==null&&typeof v==="object"&&!Array.isArray(v);
const text=(v:unknown):v is string=>typeof v==="string"&&!!v.trim();
export class PreviewError extends Error {override name="PreviewError";constructor(public status:number,public code:string){super(code);}}
const fail=(status:number,code:string):never=>{throw new PreviewError(status,code);};
const invalid=():never=>fail(400,"invalid_voice_preview_request");
export class Context {
 previews=new Map<string,Preview>();nextPreview=0;nextVoice=0;fixture=new Uint8Array();
 root?:()=>Root;
 defaults?:{time:number;duration:number;count:number;text:string;language:string;designModel:string;remixModel:string;baseModel:string;settings:NonNullable<Voice["settings"]>};
 private settings(){if(!this.root||!this.defaults||!this.fixture.length)throw new Error("Run startup or reset");return this.defaults;}
 private record(id:string){return this.previews.get(id)??fail(404,"voice_preview_not_found");}
 audio(id:string){return new Uint8Array(this.record(id).audio);}
 design(input:unknown,query:Record<string,unknown>={},legacy=false){return this.create(input,query,legacy?"legacy":"design");}
 remix(voiceId:string,input:unknown,query:Record<string,unknown>={}){
  this.settings();if(!this.root!().voices.has(voiceId))return fail(404,"voice_not_found");return this.create(input,query,"remix",voiceId);
 }
 private create(input:unknown,query:Record<string,unknown>,kind:"legacy"|"design"|"remix",voiceId?:string):Result {
  const defaults=this.settings(),root=this.root!();
  const optional=["auto_generate_text","loudness","seed","guidance_scale","should_enhance",...(kind!=="remix"?["quality"]:[]),...(kind!=="legacy"?["stream_previews","remixing_session_id","remixing_session_iteration_id","prompt_strength"]:[]),...(kind==="design"?["model_id","reference_audio_base64"]:[])];
  if(!object(input)||Object.keys(input).some(k=>!["voice_description","text",...optional].includes(k))||!text(input.voice_description)||Array.from(input.voice_description).length<(kind==="remix"?5:20)||Array.from(input.voice_description).length>1000||input.text!=null&&typeof input.text!=="string")return invalid();
  if(Object.keys(query).some(k=>k!=="output_format")||query.output_format!=null&&query.output_format!=="mp3_44100_128")return fail(400,"unsupported_voice_preview_format");
  for(const key of ["auto_generate_text","should_enhance","stream_previews"])if(input[key]!=null&&typeof input[key]!=="boolean")return invalid();
  if(input.auto_generate_text===true||input.should_enhance===true)return fail(400,"unsupported_voice_preview_processing");
  for(const key of ["seed","remixing_session_id","remixing_session_iteration_id","reference_audio_base64","prompt_strength"])if(input[key]!=null)return fail(400,"unsupported_voice_preview_option");
  if(input.loudness!=null&&input.loudness!==0.5||input.guidance_scale!=null&&input.guidance_scale!==(kind==="remix"?2:5)||input.quality!=null&&input.quality!==0.9)return fail(400,"unsupported_voice_preview_option");
  const passage=(input.text??defaults.text)as string,length=Array.from(passage).length;if(!passage.trim()||length<100||length>1000)return invalid();
  const modelId=input.model_id??(kind==="remix"?defaults.remixModel:defaults.designModel);
  if(typeof modelId!=="string"||!["eleven_multilingual_ttv_v2","eleven_ttv_v3"].includes(modelId))return invalid();
  if(!root.models.has(modelId))return fail(404,"model_not_found");
  const account=root.account;if(!account)throw new Error("Run startup or reset");const to=account.subscription.character_count+length*defaults.count;if(to>account.subscription.character_limit)return fail(429,"character_quota_exceeded");
  let next=this.nextPreview;const pending:[string,Preview][]=[];
  const language=voiceId?root.voices.get(voiceId)!.labels.language??null:defaults.language;
  for(let i=0;i<defaults.count;i++){let id:string;do{id=`sim-voice-preview-${++next}`;}while(this.previews.has(id));pending.push([id,{audio:new Uint8Array(this.fixture),text:passage,description:input.voice_description,modelId,language,...(voiceId?{sourceVoiceId:voiceId}:{})}]);}
  const result:Result={text:passage,previews:pending.map(([id,p])=>({generated_voice_id:id,audio_base_64:input.stream_previews===true?"":Buffer.from(p.audio).toString("base64"),media_type:"audio/mpeg",duration_secs:defaults.duration,language:p.language}))};
  for(const [id,p]of pending)this.previews.set(id,p);this.nextPreview=next;account.subscription.character_count=to;return result;
 }
 save(input:unknown):Voice {
  const defaults=this.settings(),root=this.root!();
  if(!object(input)||Object.keys(input).some(k=>!["voice_name","voice_description","generated_voice_id","labels","played_not_selected_voice_ids"].includes(k))||!text(input.voice_name)||!text(input.voice_description)||Array.from(input.voice_description).length<20||Array.from(input.voice_description).length>1000||!text(input.generated_voice_id)||input.labels!=null&&(!object(input.labels)||Object.values(input.labels).some(v=>typeof v!=="string")))return invalid();
  if(input.played_not_selected_voice_ids!=null&&(!Array.isArray(input.played_not_selected_voice_ids)||input.played_not_selected_voice_ids.length))return fail(400,"unsupported_voice_preview_feedback");
  const preview=this.record(input.generated_voice_id);if(preview.savedVoiceId)return fail(409,"voice_preview_already_saved");
  if(!root.account)throw new Error("Run startup or reset");if(root.voices.size>=root.account.subscription.voice_limit)return fail(409,"voice_limit_exceeded");
  if(!root.models.has(defaults.baseModel))return fail(404,"model_not_found");
  let n=this.nextVoice,id:string;do{id=`sim-designed-voice-${++n}`;}while(root.voices.has(id));
  const voice:Voice={voice_id:id,name:input.voice_name,description:input.voice_description,category:"generated",labels:structuredClone((input.labels??{})as Record<string,string>),samples:[],available_for_tiers:[],high_quality_base_model_ids:[defaults.baseModel],settings:structuredClone(defaults.settings),is_owner:true,is_legacy:false,created_at_unix:defaults.time+n,preview_url:null};
  root.voices.set(id,voice);preview.savedVoiceId=id;this.nextVoice=n;return structuredClone(voice);
 }
}
