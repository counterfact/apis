import type {Context as Root} from "../_.context.js";
import type {Context as Transcripts} from "./transcripts/_.context.js";
import type {SpeechToTextChunkResponseModel} from "../../types/v1/components/schemas/SpeechToTextChunkResponseModel.js";
import {fail,object,sourceDuration,timedText,type InputBounds} from "../forced-alignment/_.context.js";
export class Context {
 nextTranscript=0;
 root?:()=>Root;
 transcripts?:()=>Transcripts;
 defaults?:InputBounds&{text:string;language:string;languageProbability:number;models:string[]};
 transcribe(input:unknown,query:Record<string,unknown>={}){
  if(!object(input)||typeof input.model_id!=="string"||!input.model_id.trim())return fail(400,"invalid_transcription_request");
  const d=this.defaults;if(!d||!this.root||!this.transcripts)throw new Error("Run startup or reset");
  const allowed=["model_id","file","language_code","timestamps_granularity","diarize","tag_audio_events","num_speakers","file_format","webhook","temperature","seed","use_multi_channel","multichannel_output_style","no_verbatim","use_speaker_library","detect_speaker_roles","entity_redaction_mode","keyterms"];
  if(Object.keys(input).some(k=>!allowed.includes(k)))return fail(400,"unsupported_transcription_option");
  for(const [key,value] of Object.entries(input)){
   if(value==null||["model_id","file"].includes(key))continue;
   const accepted=key==="language_code"&&[d.language,"en"].includes(value as string)||key==="timestamps_granularity"&&["none","word","character"].includes(value as string)||["diarize","tag_audio_events"].includes(key)&&typeof value==="boolean"||key==="num_speakers"&&value===1||key==="file_format"&&value==="other"||["webhook","use_multi_channel","no_verbatim","use_speaker_library","detect_speaker_roles"].includes(key)&&value===false||key==="multichannel_output_style"&&value==="separate"||key==="entity_redaction_mode"&&value==="enumerated_entity_type"||key==="keyterms"&&Array.isArray(value)&&value.length===0;
   if(!accepted)return fail(400,"unsupported_transcription_option");
  }
  if(Object.keys(query).some(k=>k!=="enable_logging")||query.enable_logging!=null&&typeof query.enable_logging!=="boolean")return fail(400,"unsupported_transcription_query");
  if(!this.root().models.has(input.model_id))return fail(404,"model_not_found");
  if(!d.models.includes(input.model_id))return fail(400,"model_cannot_transcribe");
  const duration=sourceDuration(input.file,d),timing=timedText(d.text,duration,0);
  const chars=Array.from(d.text);let offset=0;
  const words:SpeechToTextChunkResponseModel["words"]=(d.text.match(/\s+|\S+/gu)??[]).map(text=>{
   const start=offset;offset+=Array.from(text).length;
   return {text,type:text.trim()?"word":"spacing",logprob:0,start:duration*start/chars.length,end:duration*offset/chars.length,...(input.diarize?{speaker_id:"speaker_0"}:{}),...(input.timestamps_granularity==="character"?{characters:timing.characters.slice(start,offset)}:{})};
  });
  const records=this.transcripts().records;let n=this.nextTranscript,id:string;do{id=`sim-generated-transcript-${++n}`;}while(records.has(id));
  const result:SpeechToTextChunkResponseModel={language_code:d.language,language_probability:d.languageProbability,text:d.text,words:input.timestamps_granularity==="none"?[]:words,audio_duration_secs:duration};
  if(query.enable_logging!==false){result.transcription_id=id;records.set(id,structuredClone(result));}
  this.nextTranscript=n;return result;
 }
}
