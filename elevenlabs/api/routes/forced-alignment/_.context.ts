import {audioDuration} from "../../support/audio.js";
import type {ForcedAlignmentResponseModel} from "../../types/v1/components/schemas/ForcedAlignmentResponseModel.js";
export class SpeechInputError extends Error {
 override name="SpeechInputError";
 constructor(public status:number,public code:string){super(code);}
}
export const fail=(status:number,code:string):never=>{throw new SpeechInputError(status,code);};
export const object=(value:unknown):value is Record<string,unknown>=>value!==null&&typeof value==="object"&&!Array.isArray(value);
export type InputBounds={maxBytes:number;minDuration:number;maxDuration:number;maxText:number};
export function sourceDuration(value:unknown,bounds:InputBounds){
 if(!object(value)||!(value.data instanceof Uint8Array)||typeof value.filename!=="string"||!value.filename.trim()||value.filename.length>255||value.size!==value.data.length||value.data.length>bounds.maxBytes||typeof value.contentType!=="string")return fail(400,"invalid_speech_input_audio");
 const duration=audioDuration(value.data,value.contentType);
 if(duration===undefined||duration<bounds.minDuration||duration>bounds.maxDuration)return fail(400,"unsupported_speech_input_audio");
 return duration;
}
/** Synthetic proportional timings, never a measurement of speech in the source. */
export function timedText(text:string,duration:number,loss:number):ForcedAlignmentResponseModel{
 const chars=Array.from(text),characters=chars.map((text,i)=>({text,start:duration*i/chars.length,end:duration*(i+1)/chars.length}));
 const words:ForcedAlignmentResponseModel["words"]=[];let at=0;
 for(const token of text.match(/\s+|\S+/gu)??[]){const size=Array.from(token).length;if(token.trim())words.push({text:token,start:duration*at/chars.length,end:duration*(at+size)/chars.length,loss});at+=size;}
 return {characters,words,loss};
}
export class Context {
 defaults?:InputBounds&{loss:number};
 align(input:unknown){
  if(!object(input)||Object.keys(input).some(k=>!["file","text"].includes(k))||typeof input.text!=="string"||!input.text.trim())return fail(400,"invalid_alignment_request");
  const d=this.defaults;if(!d)throw new Error("Run startup or reset");
  if(Array.from(input.text).length>d.maxText)return fail(400,"alignment_text_too_long");
  return timedText(input.text,sourceDuration(input.file,d),d.loss);
 }
}
