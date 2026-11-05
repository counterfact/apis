import type { Scenario } from "../types/index.js";
import { defaultSettings } from "../routes/_.context.js";
/** Optional sample fixtures; startup retains its existing empty sample baseline. */
export const voiceSampleFixtures: Scenario = ($) => {
 const c=$.loadContext("/voices/pvc");
 const audio=new Uint8Array(8340); for(let i=0;i<20;i++) audio.set([255,251,144,100],i*417);
 const duration=23040/44100;
 $.context.deleteVoice("sim-pvc-samples");
 $.context.voices.set("sim-pvc-samples",{voice_id:"sim-pvc-samples",name:"Synthetic sample voice",category:"professional",labels:{language:"en"},is_owner:true,settings:defaultSettings(),available_for_tiers:[],high_quality_base_model_ids:[],samples:[],fine_tuning:{is_allowed_to_fine_tune:false,state:{},verification_failures:[],verification_attempts_count:0,manual_verification_requested:false,language:"en"}});
 for(const [id,sid] of [["sim-pvc-samples","sim-sample"],["sim-narrator","sim-regular-sample"]]) {
  const voice=$.context.voices.get(id); if(!voice) continue;
  c.sampleAudio.set(id,new Map([[sid,new Uint8Array(audio)]]));
  voice.samples=[{sample_id:sid,file_name:"synthetic-silence.mp3",mime_type:"audio/mpeg",size_bytes:8340,hash:"5a8c648164ba405f8ddd927c3fa307e83410cedcf2ada38d4b1b14b18d0c7856",duration_secs:duration,remove_background_noise:false,has_isolated_audio:false,has_isolated_audio_preview:false}];
 }
};
/** Local authorization fixture, not a successful captcha or identity verification. */
export const verifiedVoiceSampleFixtures: Scenario = ($) => {
 const voice=$.context.voices.get("sim-pvc-samples"); if(voice?.fine_tuning) voice.fine_tuning.is_allowed_to_fine_tune=true;
 const model=$.context.models.get("eleven_multilingual_v2"); if(model) model.can_be_finetuned=true;
};
export const completeVoiceSampleSeparation: Scenario = ($) => {
 const c=$.loadContext("/voices/pvc");
 for(const [id,jobs] of c.separation) for(const [sid,job] of jobs) {
  const sample=$.context.voices.get(id)?.samples?.find(s=>s.sample_id===sid);
  if(sample?.speaker_separation?.status!=="pending") continue;
  sample.speaker_separation={voice_id:id,sample_id:sid,status:"completed",selected_speaker_ids:["sim-speaker"],speakers:{"sim-speaker":{speaker_id:"sim-speaker",duration_secs:job.duration,utterances:[]}}};
 }
};
export const completeVoiceSampleTraining: Scenario = ($) => {
 const c=$.loadContext("/voices/pvc");
 for(const [id,job] of c.training) {
  const voice=$.context.voices.get(id); if(job.status!=="queued" || !voice?.fine_tuning) continue;
  job.status="completed";voice.fine_tuning.state[job.model]="fine_tuned";
  voice.fine_tuning.dataset_duration_seconds=job.samples.reduce((n,s)=>n+(s.duration_secs??0),0);
  voice.high_quality_base_model_ids=[...new Set([...(voice.high_quality_base_model_ids??[]),job.model])];
 }
};
