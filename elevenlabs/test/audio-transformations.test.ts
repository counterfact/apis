import assert from "node:assert/strict";
import test from "node:test";
import { Context as Isolation } from "../api/routes/audio-isolation/_.context.js";
import { Context as VoiceChange } from "../api/routes/voice-changer/_.context.js";
import { createDispatcherHarness } from "../test-support/dispatcher.js";
import { createScenarioRunner } from "../test-support/scenarios.js";
import * as scenarios from "../api/scenarios/index.js";
const file = (data: Uint8Array) => ({ data, size: data.length, filename: "input.mp3", contentType: "audio/mpeg" });
test("Dispatcher transforms four multipart routes with bounded media and canonical history", async () => {
 const h = await createDispatcherHarness();
 for (const path of ["audio-isolation", "audio-isolation/stream", "voice-changer/sim-narrator", "voice-changer/sim-narrator/stream"]) {
  const source = await h.request("/v1/history/sim-history-1/audio");
  const response = await h.requestMultipart(`/v1/${path}`, {audio:file(new Uint8Array(await source.arrayBuffer()))});
  assert.equal(response.status,200,await response.clone().text()); assert.match(response.headers.get("content-type")!,/audio\/mpeg/);
  assert.equal((await response.arrayBuffer()).byteLength,8340); assert.ok(response.headers.get("request-id"));
  if(path.startsWith("voice")) { const id=response.headers.get("history-item-id")!; assert.ok(id); const item=await(await h.request(`/v1/history/${id}`)).json(); assert.equal(item.source,"STS"); assert.equal(item.model_id,"eleven_english_sts_v2"); assert.equal((await h.request(`/v1/history/${id}/audio`)).status,200); }
 }
 const isolation=await(await h.request("/v1/audio-isolation/history")).json(); assert.equal(isolation.items.length,4); assert.equal(isolation.items[0].duration_seconds,23040/44100);
 assert.equal((await(await h.request("/v1/history")).json()).history.length,4);
 const bad=await h.requestMultipart("/v1/audio-isolation",{}); assert.equal(bad.status,400);
 await h.scenario("reset"); assert.equal((await(await h.request("/v1/audio-isolation/history")).json()).items.length,2);
});
test("audio transformation contexts retain independent snapshots, use live state and fail atomically",async()=>{
 assert.equal(new Isolation().audio.length,0);assert.equal(new VoiceChange().audio.length,0);
 const r=await createScenarioRunner();await r.run(scenarios.startup);
 const isolation=r.loadContext("/audio-isolation"), voice=r.loadContext("/voice-changer"), root=r.loadContext("/"), history=r.loadContext("/history");
 const bytes=new Uint8Array(r.loadContext("/text-to-speech").audio), input={audio:file(bytes)};
 const before=root.getSubscription().character_count;
 const result=voice.change("sim-narrator",input,{});const item=history.getHistoryItem(result.historyId!)!;assert.equal(item.character_count_change_from,before);assert.equal(item.character_count_change_to,before+1);assert.equal(item.text,null);
 bytes[0]=0;result.audio[0]=0;assert.equal(history.getAudio(result.historyId!)[0],255);
 const valid={audio:file(new Uint8Array(voice.audio))};const n=voice.nextRequest, count=root.getSubscription().character_count,size=history.history.size;
 for(const [id,body,query,status] of [["missing",valid,{},404],["sim-narrator",{...valid,model_id:"missing"},{},404],["sim-narrator",{...valid,model_id:"eleven_multilingual_v2"},{},400],["sim-narrator",{...valid,seed:1},{},400],["sim-narrator",valid,{output_format:"wav_44100"},400],["sim-narrator",{audio:file(new Uint8Array([1,2,3]))},{},400]] as const)assert.throws(()=>voice.change(id,body,query),{status});
 assert.equal(voice.nextRequest,n);assert.equal(root.getSubscription().character_count,count);assert.equal(history.history.size,size);
 voice.change("sim-narrator",valid,{enable_logging:false});assert.equal(history.history.size,size);
 const isolated=isolation.isolate(valid);assert.equal(isolated.audio.length,8340);assert.equal(r.loadContext("/audio-isolation/history").records.size,3);
 assert.throws(()=>isolation.isolate({...valid,file_format:"pcm_s16le_16"}),{status:400});
 await r.run(scenarios.emptyHistory);voice.change("sim-narrator",valid,{});assert.equal(history.history.size,1);
 await r.run(scenarios.emptyIsolationHistory);isolation.isolate(valid);assert.equal(r.loadContext("/audio-isolation/history").records.size,1);
 await r.run(scenarios.quotaExhausted);assert.throws(()=>voice.change("sim-narrator",valid,{}),{status:429});assert.throws(()=>isolation.isolate(valid),{status:429});
 await r.run(scenarios.reset);assert.equal(voice.nextRequest,0);assert.equal(isolation.nextRequest,0);
});
test("Dispatcher failures preserve histories and quota, logging suppresses STS retention, WAV source remains distinct from fixed output",async()=>{
 const h=await createDispatcherHarness();const bytes=new Uint8Array(await(await h.request("/v1/history/sim-history-1/audio")).arrayBuffer()),input={audio:file(bytes)};
 const read=async(path:string)=>(await h.request(path)).json();const before=await read("/v1/user/subscription");
 for(const path of ["audio-isolation","audio-isolation/stream","voice-changer/sim-narrator","voice-changer/sim-narrator/stream"]){
  const response=await h.requestMultipart(`/v1/${path}`,{audio:file(new Uint8Array([1,2,3]))});assert.equal(response.status,400);assert.equal((await response.json()).detail.status,"unsupported_transformation_audio");
 }
 for(const [path,body,status]of [["voice-changer/missing",input,404],["voice-changer/sim-narrator",{...input,remove_background_noise:true},400],["audio-isolation",{...input,file_format:"pcm_s16le_16"},400]]as const)assert.equal((await h.requestMultipart(`/v1/${path}`,body)).status,status);
 assert.equal((await read("/v1/history")).history.length,2);assert.equal((await read("/v1/audio-isolation/history")).items.length,2);assert.equal((await read("/v1/user/subscription")).character_count,before.character_count);
 const transient=await h.requestMultipart("/v1/voice-changer/sim-narrator/stream?enable_logging=false&optimize_streaming_latency=0",input);assert.equal(transient.status,200);assert.equal(transient.headers.get("history-item-id"),null);assert.equal((await read("/v1/history")).history.length,2);
 // Two seconds of valid PCM WAV input, independently of the half-second MPEG response.
 const wav=Buffer.alloc(64044);wav.write("RIFF");wav.writeUInt32LE(wav.length-8,4);wav.write("WAVEfmt ",8);wav.writeUInt32LE(16,16);wav.writeUInt16LE(1,20);wav.writeUInt16LE(1,22);wav.writeUInt32LE(16000,24);wav.writeUInt32LE(32000,28);wav.writeUInt16LE(2,32);wav.writeUInt16LE(16,34);wav.write("data",36);wav.writeUInt32LE(64000,40);
 const wave=await h.requestMultipart("/v1/audio-isolation",{audio:{data:wav,size:wav.length,filename:"source.wav",contentType:"audio/wav"},preview_b64:"cHJldmlldw=="});assert.equal(wave.status,200);assert.deepEqual(new Uint8Array(await wave.arrayBuffer()),bytes);
 const item=(await read("/v1/audio-isolation/history")).items[0];assert.equal(item.duration_seconds,23040/44100);assert.equal(item.preview_b64,"cHJldmlldw==");assert.equal(item.download_url,null);assert.equal((await read("/v1/user/subscription")).character_count,before.character_count+3);
 await h.scenario("quotaExhausted");const size=(await read("/v1/audio-isolation/history")).items.length;assert.equal((await h.requestMultipart("/v1/audio-isolation",input)).status,429);assert.equal((await h.requestMultipart("/v1/voice-changer/sim-narrator",input)).status,429);assert.equal((await read("/v1/audio-isolation/history")).items.length,size);
 const other=await createDispatcherHarness();assert.equal((await(await other.request("/v1/audio-isolation/history")).json()).items.length,2);
});
