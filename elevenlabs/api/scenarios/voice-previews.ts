import type {Scenario} from "../types/index.js";
import {defaultSettings} from "../routes/_.context.js";
export const resetVoicePreviews:Scenario=($)=>{
 const c=$.loadContext("/text-to-voice"),speech=$.loadContext("/text-to-speech");c.previews=new Map();c.nextPreview=0;c.nextVoice=0;c.fixture=new Uint8Array(speech.audio);c.root=()=>$.context;
 c.defaults={time:1735689900,duration:speech.defaults!.duration,count:3,text:"This is a fixed synthetic passage for previewing a local interface. The returned fixture is silence and contains no synthesized spoken words.",language:"en",designModel:"eleven_multilingual_ttv_v2",remixModel:"eleven_ttv_v3",baseModel:"eleven_multilingual_v2",settings:defaultSettings()};
};
