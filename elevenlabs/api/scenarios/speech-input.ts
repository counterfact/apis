import type {Scenario} from "../types/index.js";
/** Synthetic transcript/confidence and alignment loss; no ASR, inference or remote fetch. */
export const resetSpeechInput:Scenario=($)=>{
 const speech=$.loadContext("/speech-to-text");speech.nextTranscript=0;
 speech.defaults={maxBytes:10*1024*1024,minDuration:.1,maxDuration:60,maxText:2000,text:"Synthetic simulator transcript.",language:"eng",languageProbability:1,models:["scribe_v1"]};
 speech.root=()=>$.context;speech.transcripts=()=>$.loadContext("/speech-to-text/transcripts");
 $.loadContext("/forced-alignment").defaults={maxBytes:10*1024*1024,minDuration:.1,maxDuration:60,maxText:2000,loss:.125};
};
