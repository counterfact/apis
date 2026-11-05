import type {Scenario} from "../types/index.js";
export const resetDubbingProcessing: Scenario = $ => {
 const r=$.loadContext("/dubbing/resource"),p=$.loadContext("/dubbing/project"),l=$.loadContext("/dubbing");
 r.jobs=new Map();r.nextRenderId=1;r.candidates=[...$.context.voices.values()].filter(v=>v.category!=="high_quality").map(v=>({voice_id:v.voice_id,name:v.name,category:v.category as Exclude<typeof v.category,"high_quality">,description:v.description??null,preview_url:null}));
 p.regenerations=new Map();p.editedSegments=new Map();l.audio=new Map();const audio=$.loadContext("/text-to-speech").audio;
 l.audio.set("sim-legacy-dub",{en:new Uint8Array(audio),es:new Uint8Array(audio)});
};
export const completeDubbingProcessing: Scenario = $ => {
 const c=$.loadContext("/dubbing/resource");
 for(const [id,j] of c.jobs){
  const r=c.resources.get(id);if(!r){c.jobs.delete(id);continue;}
  if(j.kind==="render"){
   const render=r.renders[j.renderId!];render.status="complete";render.media_ref={...structuredClone(j.snapshot.input),src:j.renderId!,url:`https://simulator.invalid/dubbing-renders/${j.renderId}.mp3`,duration_secs:23040/44100,content_type:"audio/mpeg",is_audio:true};
  }else for(const sid of j.segments){
   const s=r.speaker_segments[sid],source=j.snapshot.speaker_segments[sid];
   if(j.kind==="transcribe"||!s.text)s.text=`[synthetic transcript] ${source.text||sid}`;
   if(j.kind==="transcribe"){for(const d of Object.values(s.dubs))d.audio_stale=true;continue;}
   for(const l of j.languages){const d=s.dubs[l];
    if(j.kind==="translate"||!d.text)d.text=`[synthetic ${l}] ${s.text}`;
    d.audio_stale=j.kind!=="dub";
    if(j.kind==="dub")d.media_ref={...structuredClone(j.snapshot.input),src:`${id}/${sid}/${l}`,url:`https://simulator.invalid/dubbing-segments/${id}/${sid}/${l}.mp3`,duration_secs:23040/44100,content_type:"audio/mpeg",is_audio:true};
   }
  }
  r.version++;c.jobs.delete(id);
 }
 const p=$.loadContext("/dubbing/project");
 for(const [key,j] of p.regenerations){
  const l=p.projects.get(j.projectId)?.languages.get(j.languageId);
  if(l){l.metadata.status="completed";l.metadata.output_revision=j.revision;l.metadata.updated_at=p.timestamp;l.metadata.outputs={lossless_audio:`https://simulator.invalid/dubbing/${j.languageId}.flac`,subtitles:`https://simulator.invalid/dubbing/${j.languageId}.vtt`};p.editedSegments.delete(key);}
  p.regenerations.delete(key);
 }
};
