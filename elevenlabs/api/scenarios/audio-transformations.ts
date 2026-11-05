import type { Scenario } from "../types/index.js";
/** Bounded synthetic MPEG output; source duration controls local usage, never output length. */
export const resetAudioTransformations:Scenario=($)=>{
 const isolation=$.loadContext("/audio-isolation"),voice=$.loadContext("/voice-changer"),speech=$.loadContext("/text-to-speech");
 isolation.audio=new Uint8Array(speech.audio);isolation.nextRequest=0;isolation.defaults={time:1735690000,duration:23040/44100,chargePerSecond:1};isolation.root=()=>$.context;isolation.history=()=>$.loadContext("/audio-isolation/history");
 voice.audio=new Uint8Array(speech.audio);voice.nextRequest=0;voice.defaults={time:1735690000,model:"eleven_english_sts_v2",format:"mp3_44100_128",chargePerSecond:1};voice.root=()=>$.context;voice.history=()=>$.loadContext("/history");
};
