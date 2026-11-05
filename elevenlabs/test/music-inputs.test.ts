import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { Context } from "../api/routes/music/_.context.js";
import { crc32 } from "node:zlib";
import { createScenarioRunner } from "../test-support/scenarios.js";
import { createDispatcherHarness } from "../test-support/dispatcher.js";
import * as scenarios from "../api/scenarios/index.js";
const file = (data: Uint8Array, contentType = "audio/mpeg", filename = "input.mp3") => ({ data: new Uint8Array(data), size: data.length, contentType, filename });
async function setup() { const r = await createScenarioRunner(); await r.run(scenarios.startup); return r; }
function entries(bytes: Uint8Array) {
 const b = Buffer.from(bytes), result = new Map<string,Buffer>(); let at = 0;
 while (b.readUInt32LE(at) === 0x04034b50) {
  const size = b.readUInt32LE(at+18), n = b.readUInt16LE(at+26), start=at+30+n+b.readUInt16LE(at+28);
  const data=b.subarray(start,start+size);assert.equal(crc32(data),b.readUInt32LE(at+14));
  result.set(b.toString("utf8",at+30,at+30+n),data);at=start+size;
 }
 assert.equal(b.readUInt32LE(at),0x02014b50);assert.equal(b.readUInt32LE(b.length-22),0x06054b50);return result;
}
test("music upload context shares canonical songs and copies sources with atomic validation/reset",async()=>{
 assert.throws(()=>new Context().upload({}));
 const r=await setup(),c=r.loadContext("/music"), source=file(c.audio);
 const uploaded=c.upload({file:source});assert.equal(uploaded.song_id,"sim-music-song-1");
 assert.deepEqual(Object.keys(uploaded),["song_id"]);assert.deepEqual(c.songs.get(uploaded.song_id)!.audio,source.data);
 source.data[0]=0;assert.equal(c.songs.get(uploaded.song_id)!.audio[0],255);
 assert.equal(c.compose({prompt:"Synthetic"}).songId,"sim-music-song-2");
 const before=c.songs.size,next=c.nextSong;
 for(const body of [{file:file(new Uint8Array([1,2]))},{file:file(c.audio),with_timestamps:true},{file:file(c.audio),extract_composition_plan:true},{file:file(c.audio),with_waveform_visual:true}])assert.throws(()=>c.upload(body));
 for(const invalid of [{...file(c.audio),size:1},{...file(c.audio),filename:" "},file(c.audio,"audio/wav"),file(new Uint8Array(8*1024*1024+1))])assert.throws(()=>c.upload({file:invalid}));
 assert.equal(c.songs.size,before);assert.equal(c.nextSong,next);
 const wav=Buffer.alloc(46);wav.write("RIFF");wav.writeUInt32LE(38,4);wav.write("WAVEfmt ",8);wav.writeUInt32LE(16,16);wav.writeUInt16LE(1,20);wav.writeUInt16LE(1,22);wav.writeUInt32LE(8000,24);wav.writeUInt32LE(16000,28);wav.writeUInt16LE(2,32);wav.writeUInt16LE(16,34);wav.write("data",36);wav.writeUInt32LE(2,40);
 const wave=c.upload({file:file(wav,"audio/wav","silence.wav")});assert.equal(c.songs.get(wave.song_id)!.contentType,"audio/wav");assert.equal(c.songs.get(wave.song_id)!.durationMs,0.125);
 await r.run(scenarios.reset);assert.equal(c.songs.size,0);assert.equal(c.nextSong,0);
 r.context.models.delete("music_v1");assert.throws(()=>c.upload({file:file(c.audio)}),{code:"model_not_found"});
});
test("finetune creation uses canonical records, live models, copied metadata and ownership",async()=>{
 const r=await setup(),c=r.loadContext("/music/finetunes"),music=r.loadContext("/music");
 const tags=["synthetic"],created=c.create({name:"My local model",primary_genre:"ambient",files:[file(music.audio)],tags});
 assert.equal(created.id,"sim-music-finetune-1");assert.equal(created.created_by,"self");assert.equal(created.visibility,"private");assert.equal(created.status,"completed");
 tags.push("changed");created.tags.push("returned");assert.deepEqual(c.get(created.id).tags,["synthetic"]);
 assert.equal(c.list({created_by:"self"}).finetunes.length,2);c.update(created.id,{name:"Renamed"});c.delete(created.id);assert.throws(()=>c.get(created.id));
 const next=c.nextFinetune;for(const b of [{name:"short",primary_genre:"x"},{name:"tiny",primary_genre:"x",files:[file(music.audio)]},{name:"Valid name",primary_genre:"x",files:[file(music.audio)],model_id:"music_v2"}])assert.throws(()=>c.create(b));
 assert.equal(c.nextFinetune,next);r.context.models=new Map();assert.throws(()=>c.create({name:"Valid name",primary_genre:"x",files:[file(music.audio)]}),{code:"model_not_found"});
 await r.run(scenarios.reset);assert.equal(c.nextFinetune,0);assert.equal(c.records.size,3);
});
test("stem archives and opaque video context return copied bounded synthetic outputs",async()=>{
 const r=await setup(),c=r.loadContext("/music"),video=file(await readFile(new URL("fixtures/music-black.mp4",import.meta.url)),"video/mp4","black.mp4");
 const six=entries(c.separateStems({file:file(c.audio)}));assert.equal(six.size,6);for(const data of six.values())assert.deepEqual(data,Buffer.from(c.audio));
 assert.equal(entries(c.separateStems({file:file(c.audio),stem_variation_id:"two_stems_v1"})).size,2);
 const output=c.videoToMusic({videos:[video]});assert.equal(output.songId,"sim-music-song-1");assert.deepEqual(output.audio,c.audio);assert.equal(output.durationMs,3840);
 output.audio[0]=0;assert.equal(c.songs.get(output.songId)!.audio[0],255);
 const sourceSnapshot = c.songs.get(output.songId)!.input as {videos: {data: Uint8Array}[]};video.data[0]=255;assert.equal(sourceSnapshot.videos[0].data[0],0);
 c.videoToMusic({videos:[video]},{enable_logging:false});assert.equal(c.songs.size,1);
 for(const b of [{videos:[{...video,size:1}]},{videos:[{...video,filename:" "}]},{videos:Array(11).fill(video)},{videos:[]},{videos:[{...video,contentType:"audio/mpeg"}]},{videos:[video],add_sfx:true},{videos:[video],separate_tracks:true}])assert.throws(()=>c.videoToMusic(b));
 for(const b of [{file:file(c.audio),sign_with_c2pa:true},{file:file(c.audio),stem_variation_id:"bad"}])assert.throws(()=>c.separateStems(b));
 assert.throws(()=>c.separateStems({file:file(c.audio)},{output_format:"pcm_44100"}));
 assert.equal(c.songs.size,1);assert.equal(c.nextSong,2);
 r.context.models.delete("music_v1");assert.throws(()=>c.videoToMusic({videos:[video]}),{code:"model_not_found"});
 c.audio=new Uint8Array();assert.throws(()=>c.separateStems({file:file(r.loadContext("/text-to-speech").audio)}));
});
test("music input Dispatcher validates multipart and exposes upload/finetune lifecycle plus reset",async()=>{
 const h=await createDispatcherHarness(),r=await setup(),audio=r.loadContext("/music").audio;
 assert.equal((await h.requestMultipart("/v1/music/upload",{})).status,400);
 assert.equal((await h.requestMultipart("/v1/music/finetunes",{name:42,primary_genre:"x",files:[file(audio)]})).status,400);
 const upload=await h.requestMultipart("/v1/music/upload",{file:file(audio)});assert.equal(upload.status,200);assert.deepEqual(await upload.json(),{song_id:"sim-music-song-1"});
 const create=await h.requestMultipart("/v1/music/finetunes",{name:"Local music",primary_genre:"ambient",files:[file(audio)]});assert.equal(create.status,201);const row=await create.json();assert.equal(row.id,"sim-music-finetune-1");assert.equal(row.model_id,"music_v1");
 assert.equal((await (await h.request(`/v1/music/finetunes/${row.id}`)).json()).name,"Local music");
 assert.equal((await h.request(`/v1/music/finetunes/${row.id}`,{method:"DELETE"})).status,200);assert.equal((await h.request(`/v1/music/finetunes/${row.id}`)).status,404);
 assert.equal((await h.requestMultipart("/v1/music/finetunes",{name:"Local music",primary_genre:"ambient"})).status,400);
 await h.scenario("emptyModels");assert.equal((await h.requestMultipart("/v1/music/upload",{file:file(audio)})).status,404);
 await h.scenario("reset");assert.equal((await (await h.requestMultipart("/v1/music/upload",{file:file(audio)})).json()).song_id,"sim-music-song-1");
 const other=await createDispatcherHarness();assert.equal((await(other.requestMultipart("/v1/music/finetunes",{name:"Other music",primary_genre:"ambient",files:[file(audio)]}))).status,201);
});
test("music processing Dispatcher returns valid six/two-stem ZIPs and MPEG video output with shared IDs",async()=>{
 const h=await createDispatcherHarness(),r=await setup(),audio=r.loadContext("/music").audio;
 for(const [variation,count] of [[undefined,6],["two_stems_v1",2]] as const){const response=await h.requestMultipart("/v1/music/stem-separation",{file:file(audio),...(variation?{stem_variation_id:variation}:{})});assert.equal(response.status,200);assert.equal(response.headers.get("content-type"),"application/zip");assert.match(response.headers.get("content-disposition")!,/stems.zip/);assert.equal(entries(new Uint8Array(await response.arrayBuffer())).size,count);}
 assert.equal((await h.requestMultipart("/v1/music/stem-separation",{file:file(audio),stem_variation_id:"bad"})).status,400);
 assert.equal((await h.requestMultipart("/v1/music/video-to-music",{videos:[]})).status,400);
 const video=file(await readFile(new URL("fixtures/music-black.mp4",import.meta.url)),"video/mp4","black.mp4");
 const response=await h.requestMultipart("/v1/music/video-to-music",{videos:[video]});assert.equal(response.status,200);assert.equal(response.headers.get("song-id"),"sim-music-song-1");assert.equal(response.headers.get("content-type"),"audio/mpeg");assert.deepEqual(new Uint8Array(await response.arrayBuffer()),audio);
 const upload=await h.requestMultipart("/v1/music/upload",{file:file(audio)});assert.equal((await upload.json()).song_id,"sim-music-song-2");
 assert.equal((await h.requestMultipart("/v1/music/video-to-music",{videos:[video],use_audio_as_reference:true})).status,400);
 assert.equal((await h.requestMultipart("/v1/music/video-to-music?output_format=pcm_44100",{videos:[video]})).status,400);
});

test("combined music inputs: training accepts 8 MiB and rejects larger requests atomically", async () => {
  const r = await setup(), finetunes = r.loadContext("/music/finetunes");
  const half = 4 * 1024 * 1024;
  const wav = (size: number) => {
    const bytes = Buffer.alloc(size);
    bytes.write("RIFF"); bytes.writeUInt32LE(size - 8, 4); bytes.write("WAVEfmt ", 8);
    bytes.writeUInt32LE(16, 16); bytes.writeUInt16LE(1, 20); bytes.writeUInt16LE(1, 22);
    bytes.writeUInt32LE(8000, 24); bytes.writeUInt32LE(16000, 28);
    bytes.writeUInt16LE(2, 32); bytes.writeUInt16LE(16, 34);
    bytes.write("data", 36); bytes.writeUInt32LE(size - 44, 40);
    return file(bytes, "audio/wav", "bounded.wav");
  };
  const training = { name: "Bounded model", primary_genre: "ambient", files: [wav(half), wav(half)] };
  const created = finetunes.create(training);
  assert.equal(finetunes.get(created.id).name, "Bounded model");
  const records = structuredClone(finetunes.records), nextFinetune = finetunes.nextFinetune;
  assert.throws(() => finetunes.create({ ...training, files: [training.files[0], wav(half + 2)] }), { code: "training_files_too_large" });
  assert.deepEqual(finetunes.records, records); assert.equal(finetunes.nextFinetune, nextFinetune);

  await r.run(scenarios.reset);
  assert.equal(finetunes.records.size, 3);
  assert.throws(() => finetunes.create({ ...training, files: [training.files[0], wav(half + 2)] }), { code: "training_files_too_large" });
  assert.equal(finetunes.nextFinetune, 0);
});

test("combined music inputs: video accepts 8 MiB and rejects larger requests atomically", async () => {
  const r = await setup(), music = r.loadContext("/music"), half = 4 * 1024 * 1024;
  const video = file(new Uint8Array(half), "video/mp4", "opaque.mp4");
  const output = music.videoToMusic({ videos: [video, video] });
  assert.equal(music.songs.get(output.songId)!.durationMs, 3840);
  const songs = structuredClone(music.songs), nextSong = music.nextSong;
  assert.throws(() => music.videoToMusic({ videos: [video, file(new Uint8Array(half + 2), "video/mp4", "opaque.mp4")] }), { code: "video_size_exceeded" });
  assert.deepEqual(music.songs, songs); assert.equal(music.nextSong, nextSong);

  await r.run(scenarios.reset);
  assert.equal(music.songs.size, 0);
  assert.throws(() => music.videoToMusic({ videos: [video, file(new Uint8Array(half + 2), "video/mp4", "opaque.mp4")] }), { code: "video_size_exceeded" });
  assert.equal(music.nextSong, 0);
});
