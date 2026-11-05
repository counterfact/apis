import assert from "node:assert/strict";
import {test} from "node:test";
import {createDispatcherHarness} from "../test-support/dispatcher.js";
import {createScenarioRunner} from "../test-support/scenarios.js";
import {reset, completeDubbingLanguages} from "../api/scenarios/index.js";
import type {Context} from "../api/routes/dubbing/resource/_.context.js";
const base="/v1/dubbing/resource/sim-dubbing-resource";
const json=(body:unknown)=>({method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(body)});
test("Dubbing context queues immutable selections and validates atomically",async()=>{
 const h=await createScenarioRunner();await h.run(reset);const c=h.loadContext("/dubbing/resource") as Context;
 const before=c.get("sim-dubbing-resource");assert.throws(()=>c.process("sim-dubbing-resource","dub",{segments:["sim-dubbing-segment","missing"],languages:null}));assert.deepEqual(c.get("sim-dubbing-resource"),before);assert.equal(c.jobs.size,0);
 assert.equal(c.process("sim-dubbing-resource","transcribe",{segments:["sim-dubbing-segment"]}).version,2);assert.equal(c.jobs.get("sim-dubbing-resource")!.snapshot.version,1);assert.equal(c.jobs.get("sim-dubbing-resource")!.snapshot.speaker_segments["sim-dubbing-segment"].text,"Local source");assert.throws(()=>c.updateSegment("sim-dubbing-resource","sim-dubbing-segment","en",{text:"Later"}));
});
test("Dubbing seven routes use synthetic scenario completion and buffered MP3",async()=>{
 const h=await createDispatcherHarness();const req=async(path:string,init:RequestInit={},status=200)=>{const r=await h.request(path,init);assert.equal(r.status,status,path);return r;};
 for(const action of ["transcribe","translate","dub"]){await req(base+"/"+action,json(action==="transcribe"?{segments:[]}:{segments:[],languages:null}));await req(base+"/dub",json({segments:[],languages:null}),409);await h.scenario("completeDubbingProcessing");}
 assert.equal((await(await req(base)).json()).speaker_segments["sim-dubbing-segment"].dubs.es.audio_stale,false);
 const render=await(await req(base+"/render/es",json({render_type:"mp3"}))).json();assert.equal(render.render_id,"sim-dubbing-render-1");assert.equal((await(await req(base)).json()).renders[render.render_id].status,"processing");await h.scenario("completeDubbingProcessing");assert.equal((await(await req(base)).json()).renders[render.render_id].status,"complete");const terminal=await(await req(base)).json();await h.scenario("completeDubbingProcessing");assert.deepEqual(await(await req(base)).json(),terminal);
 await req(base+"/render/es",json({render_type:"wav"}),400);await req(base+"/render/es",json({render_type:"mp3",normalize_volume:true}),400);assert.equal((await(await req(base+"/speaker/sim-dubbing-speaker/similar-voices")).json()).voices.length,2);
 const p="/v1/dubbing/project/sim-dubbing-project/language/sim-dubbing-es";await req(p+"/transcript/regenerate",{method:"POST"},409);await req(p+"/transcript/segment/sim-dubbing-segment",{...json({translation:"Edited"}),method:"PATCH"});const regen=await(await req(p+"/transcript/regenerate",{method:"POST"},202)).json();assert.deepEqual(regen.regenerated_segment_ids,["sim-dubbing-segment"]);assert.equal((await(await req(p)).json()).status,"processing");await h.scenario("completeDubbingProcessing");assert.equal((await(await req(p)).json()).status,"completed");
 const audio=await req("/v1/dubbing/sim-legacy-dub/audio/es");assert.equal(audio.headers.get("content-type"),"audio/mpeg");assert.equal((await audio.arrayBuffer()).byteLength,8340);await req("/v1/dubbing/sim-legacy-pending/audio/es",{},425);await req("/v1/dubbing/sim-legacy-dub/audio/fr",{},404);await h.scenario("reset");assert.deepEqual((await(await req(base)).json()).renders,{});
});
test("Dubbing direct regeneration preserves selected snapshots and media copies",async()=>{
 const h=await createScenarioRunner();await h.run(reset);
 const p=h.loadContext("/dubbing/project");const pid="sim-dubbing-project",lid="sim-dubbing-es",sid="sim-dubbing-segment";
 assert.throws(()=>p.regenerate(pid,lid));p.updateTarget(pid,lid,{[sid]:{translation:"Previously completed"}});await h.run(completeDubbingLanguages);assert.equal(p.editedSegments.size,0);p.updateTarget(pid,lid,{[sid]:{translation:"Edited"}});
 const accepted=p.regenerate(pid,lid);assert.equal(accepted.regenerated_seconds,2);assert.equal(accepted.charged_seconds,0);
 assert.equal(p.regenerations.get(`${pid}/${lid}`)!.translations.get(sid),"Edited");
 assert.throws(()=>p.updateTarget(pid,lid,{[sid]:{translation:"Later"}}));assert.throws(()=>p.updateSource(pid,{[sid]:{text:"Later"}}));
 const legacy=h.loadContext("/dubbing");const audio=legacy.getAudio("sim-legacy-dub","es");audio[0]=0;assert.equal(legacy.getAudio("sim-legacy-dub","es")[0],255);
 legacy.delete("sim-legacy-dub");assert.equal(legacy.audio.has("sim-legacy-dub"),false);
 p.deleteLanguage(pid,lid);assert.equal(p.regenerations.size,0);
});
test("Dubbing invalid processing is atomic; reset cancels queues and instances isolate",async()=>{
 const h=await createDispatcherHarness();const read=async()=> (await h.request(base)).json();const before=await read();
 for(const [path,body,status] of [["/translate",{segments:["sim-dubbing-segment","missing"],languages:null},404],["/dub",{segments:[],languages:["fr"]},404],["/transcribe",{segments:42},400],["/render/es",{render_type:"mp3",normalize_volume:true},400]] as const){assert.equal((await h.request(base+path,json(body))).status,status);assert.deepEqual(await read(),before);}
 assert.equal((await h.request(base+"/speaker/missing/similar-voices")).status,404);
 await h.request(base+"/dub",json({segments:[],languages:null}));const other=await createDispatcherHarness();assert.deepEqual(await(await other.request(base)).json(),before);
 await h.scenario("reset");await h.scenario("completeDubbingProcessing");assert.deepEqual(await read(),before);
});
