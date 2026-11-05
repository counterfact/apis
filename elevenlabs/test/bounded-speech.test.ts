import assert from "node:assert/strict";
import test from "node:test";
import { Context } from "../api/routes/text-to-speech/_.context.js";
import { createScenarioRunner } from "../test-support/scenarios.js";
import { createDispatcherHarness } from "../test-support/dispatcher.js";
import * as scenarios from "../api/scenarios/index.js";
test("speech context starts empty and applies bounded fixtures with canonical quota/history",async()=>{
 const empty=new Context();assert.equal(empty.audio.length,0);assert.equal(empty.nextRender,0);
 const r=await createScenarioRunner();await r.run(scenarios.startup);const c=r.loadContext("/text-to-speech"),root=r.loadContext("/");
 const before=root.getSubscription().character_count;const result=c.speech("sim-narrator",{text:"A😀B"},{});
 assert.equal(result.audio.length,8340);for(let n=0;n<20;n++)assert.deepEqual([...result.audio.slice(n*417,n*417+4)],[255,251,144,100]);
 assert.deepEqual(result.payload.alignment?.characters,["A","😀","B"]);assert.equal(result.payload.alignment?.character_end_times_seconds.at(-1),23040/44100);
 assert.equal(root.getSubscription().character_count,before+3);const h=r.loadContext("/history");assert.equal(h.getHistoryItem(result.historyId!)?.text,"A😀B");assert.deepEqual(h.audio.get(result.historyId!),result.audio);
 result.audio[0]=0;assert.equal(h.audio.get(result.historyId!)![0],255);assert.equal(root.getVoice("sim-narrator")?.voice_id,"sim-narrator");
 const dlg=c.dialogue({inputs:[{text:"Hi",voice_id:"sim-narrator"},{text:"😀",voice_id:"sim-assistant"}]},{});
 assert.deepEqual(dlg.payload.voice_segments.map(x=>[x.voice_id,x.character_start_index,x.character_end_index]),[["sim-narrator",0,2],["sim-assistant",2,3]]);
 assert.equal(h.getHistoryItem(dlg.historyId!)?.dialogue?.length,2);assert.equal(h.getHistoryItem(dlg.historyId!)?.text,null);
 h.deleteHistoryItem(dlg.historyId!);assert.equal(h.audio.has(dlg.historyId!),false);await r.run(scenarios.reset);assert.equal(c.nextRender,0);assert.equal(h.audio.size,2);
});
test("speech validation and quota failures are atomic, retention is explicit",async()=>{
 const r=await createScenarioRunner();await r.run(scenarios.startup);const c=r.loadContext("/text-to-speech"),root=r.loadContext("/"),history=r.loadContext("/history");const before=structuredClone([...history.history]);
 for(const [voice,body,q,status]of [["missing",{text:"Hi"},{},404],["sim-narrator",{text:""},{},400],["sim-narrator",{text:"Hi",model_id:"missing"},{},404],["sim-narrator",{text:"Hi",seed:1},{},400],["sim-narrator",{text:"Hi"},{output_format:"wav_44100"},400]]as const)assert.throws(()=>c.speech(voice,body,q),{status});
 assert.throws(()=>c.dialogue({inputs:[{text:"Hi",voice_id:"sim-narrator"},{text:"Hi",voice_id:"missing"}]},{}),{status:404});assert.equal(c.nextRender,0);assert.deepEqual([...history.history],before);
 const count=root.getSubscription().character_count;c.speech("sim-narrator",{text:"Hi"},{enable_logging:false});assert.equal(history.history.size,2);assert.equal(history.audio.size,2);assert.equal(root.getSubscription().character_count,count+2);
 await r.run(scenarios.quotaExhausted);const n=c.nextRender;assert.throws(()=>c.speech("sim-narrator",{text:"Hi"},{}),{status:429});assert.equal(c.nextRender,n);
});
test("Dispatcher serves all eight bounded speech endpoints with exact media, state, reset and isolation",async()=>{
 const h=await createDispatcherHarness();const post=async(path:string,body:unknown,status=200)=>{const x=await h.request(`/v1/${path}`,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(body)});assert.equal(x.status,status,await x.clone().text());return x;};
 const before=(await(await h.request("/v1/user/subscription")).json()).character_count;
 for(const group of ["text-to-speech/sim-narrator","text-to-dialogue"]){const body=group.startsWith("text-to-speech")?{text:"A😀B"}:{inputs:[{text:"A",voice_id:"sim-narrator"},{text:"😀B",voice_id:"sim-assistant"}]};
  for(const suffix of ["","/stream","/with-timestamps","/stream/with-timestamps"]){const response=await post(group+suffix,body);assert.ok(response.headers.get("request-id"));assert.ok(response.headers.get("history-item-id"));if(suffix.includes("timestamps")){assert.match(response.headers.get("content-type")!,/application\/json/);const data=await response.json();const bytes=Buffer.from(data.audio_base64,"base64");assert.equal(bytes.length,8340);assert.deepEqual([...bytes.subarray(0,4)],[255,251,144,100]);assert.deepEqual(data.alignment.characters,["A","😀","B"]);if(group==="text-to-dialogue")assert.equal(data.voice_segments.length,2);}else{assert.match(response.headers.get("content-type")!,/audio\/mpeg/);const bytes=new Uint8Array(await response.arrayBuffer());assert.equal(bytes.byteLength,8340);assert.deepEqual([...bytes.slice(0,4)],[255,251,144,100]);}}
 }
 assert.equal((await(await h.request("/v1/user/subscription")).json()).character_count,before+24);assert.equal((await(await h.request("/v1/history")).json()).history.length,10);
 const transient=await post("text-to-speech/sim-narrator?enable_logging=false",{text:"Hi"});assert.equal(transient.headers.get("history-item-id"),null);assert.ok(transient.headers.get("request-id"));assert.equal((await(await h.request("/v1/history")).json()).history.length,10);assert.equal((await(await h.request("/v1/user/subscription")).json()).character_count,before+26);
 await post("text-to-speech/missing",{text:"Hi"},404);await post("text-to-speech/sim-narrator?output_format=wav_44100",{text:"Hi"},400);await post("text-to-dialogue",{inputs:[{voice_id:"sim-narrator",text:42}]},400);
 await h.scenario("quotaExhausted");await post("text-to-speech/sim-narrator",{text:"Hi"},429);assert.equal((await(await h.request("/v1/history")).json()).history.length,10);
 const other=await createDispatcherHarness();assert.equal((await(await other.request("/v1/history")).json()).history.length,2);await h.scenario("reset");assert.equal((await(await h.request("/v1/history")).json()).history.length,2);
});
