import type { Context as Root } from "../_.context.js";
import type { Context as IsolationHistory } from "./history/_.context.js";
import { audioDuration } from "../../support/audio.js";
export class TransformationError extends Error {
 override name = "TransformationError";
 constructor(public status:number,public code:string){super(code);}
}
export const fail=(status:number,code:string):never=>{throw new TransformationError(status,code);};
export const object=(v:unknown):v is Record<string,unknown>=>v!==null&&typeof v==="object"&&!Array.isArray(v);
/** Validate the public parsed multipart file; no codecs or inference are invoked. */
export function sourceDuration(value:unknown){
 if(!object(value)||!(value.data instanceof Uint8Array)||typeof value.filename!=="string"||!value.filename.trim()||value.filename.length>255||value.size!==value.data.length||value.data.length>10*1024*1024||typeof value.contentType!=="string")return fail(400,"invalid_transformation_audio");
 const duration=audioDuration(value.data,value.contentType);
 if(duration===undefined||duration<=0||duration>60)return fail(400,"unsupported_transformation_audio");
 return duration;
}
export class Context {
 audio=new Uint8Array();nextRequest=0;
 root?:()=>Root;history?:()=>IsolationHistory;
 defaults?:{time:number;duration:number;chargePerSecond:number};
 isolate(input:unknown,stream=false){
  if(!object(input)||Object.keys(input).some(k=>!["audio","file_format",...(stream?[]:["preview_b64"])].includes(k)))return fail(400,"invalid_isolation_request");
  if(input.file_format!=null&&input.file_format!=="other")return fail(400,"unsupported_input_format");
  if(input.preview_b64!=null&&(typeof input.preview_b64!=="string"||input.preview_b64.length>65536))return fail(400,"invalid_isolation_preview");
  const duration=sourceDuration(input.audio),d=this.defaults;
  if(!d||!this.root||!this.history||!this.audio.length)throw new Error("Run startup or reset");
  const account=this.root().account;if(!account)throw new Error("Run startup or reset");
  const cost=Math.ceil(duration*d.chargePerSecond),to=account.subscription.character_count+cost;
  if(to>account.subscription.character_limit)return fail(429,"character_quota_exceeded");
  const history=this.history();let n=this.nextRequest,id:string;do{id=`sim-isolation-${++n}`;}while(history.records.has(id));
  history.records.set(id,{text:"Synthetic isolation fixture; no audio processing performed.",item:{id,title:"Synthetic audio isolation",created_at_unix:d.time+n,format:"mp3",duration_seconds:d.duration,download_url:null,icon_url:null,source_video_url:null,supports_video:false,processing:false,video_processing_failed:false,preview_b64:input.preview_b64 as string|null|undefined??null}});
  this.nextRequest=n;account.subscription.character_count=to;
  return {audio:new Uint8Array(this.audio),requestId:`sim-isolation-request-${n}`,historyId:id};
 }
}
