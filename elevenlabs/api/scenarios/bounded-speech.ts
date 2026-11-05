import type {Scenario} from "../types/index.js";
/** Twenty independently decoded MPEG-1 Layer III stereo silence frames. */
export const resetBoundedSpeech:Scenario=($)=>{
 const c=$.loadContext("/text-to-speech");c.audio=new Uint8Array(417*20);for(let n=0;n<20;n++)c.audio.set([255,251,144,100],n*417);
 c.nextRender=0;c.defaults={time:1735689800,duration:23040/44100,maxCharacters:2000,ttsModel:"eleven_multilingual_v2",dialogueModel:"eleven_v3",format:"mp3_44100_128"};
 c.root=()=>$.context;c.history=()=>$.loadContext("/history");$.loadContext("/text-to-dialogue").rendering=()=>c;
};
