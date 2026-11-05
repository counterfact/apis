import assert from "node:assert/strict";
import test from "node:test";
import { createScenarioRunner } from "../test-support/scenarios.js";
import { createDispatcherHarness } from "../test-support/dispatcher.js";
import * as scenarios from "../api/scenarios/index.js";
const upload=(text:string,filename="guide.txt",contentType="text/plain")=>{const data=new TextEncoder().encode(text);return {data,size:data.length,filename,contentType};};
const base="/v1/convai/knowledge-base";
const pls=(inner:string)=>`<lexicon xmlns="http://www.w3.org/2005/01/pronunciation-lexicon" version="1.0" alphabet="ipa">${inner}</lexicon>`;

test("PLS context imports canonical snapshots, roundtrips escapes, and rejects unsafe XML atomically",async()=>{
 const r=await createScenarioRunner();await r.run(scenarios.startup);const c=r.loadContext("/pronunciation-dictionaries");
 const original=[{type:"alias" as const,string_to_replace:"<&😀",alias:"A & B\r\n\t"},{type:"phoneme" as const,string_to_replace:"word",phoneme:"<>&",alphabet:"ipa\"\r\n\t"}];
 c.setRules("sim-dictionary",original);const xml=c.downloadDictionary("sim-dictionary","sim-dictionary-v2").value!;
 const imported=c.createFromFile({name:"Imported",description:"copy",file:upload(xml,"terms.pls","application/pls+xml")}).value!;
 assert.equal(imported.version_rules_num,2);assert.deepEqual(c.getDictionary(imported.id)!.rules,original);
 assert.equal(c.downloadDictionary(imported.id,imported.version_id).value,xml);
 const before=structuredClone(c.dictionaries),counter=c.nextDictionaryNumber;
 for(const text of ["broken",'<!DOCTYPE lexicon [<!ENTITY x "bad">]>'+pls('<lexeme><grapheme>x</grapheme><alias>&x;</alias></lexeme>'),pls('<lexeme><grapheme>x</grapheme><alias><b>bad</b></alias></lexeme>'),pls('<lexeme><grapheme></grapheme><alias>x</alias></lexeme>'),pls('<lexeme><grapheme>x</grapheme><alias>&unknown;</alias></lexeme>'),pls('<lexeme><grapheme>x</grapheme><alias>a</alias><phoneme>b</phoneme></lexeme>'),'<!DOCTYPE lexicon SYSTEM "https://external.invalid/a.dtd">'+pls(""),pls("<unknown/>"),pls('<lexeme><grapheme>x</grapheme><phoneme unknown="x">y</phoneme></lexeme>'),'<lexicon version="1.0"/ >'])assert.ok(c.createFromFile({name:"Bad",file:upload(text,"x.pls","application/xml")}).error);
 for(const file of [{...upload(xml,"x.pls","application/xml"),size:1},upload(xml,"x.pdf","application/pdf"),{...upload("x","x.pls","application/xml"),data:new Uint8Array([255]),size:1},upload("x".repeat(1_048_577),"x.pls","application/xml")])assert.ok(c.createFromFile({name:"Bad",file}).error);
 assert.ok(c.createFromFile({name:"Bad"}).error);assert.deepEqual(c.dictionaries,before);assert.equal(c.nextDictionaryNumber,counter);
 const empty=c.createFromFile({name:"Empty",file:upload(pls(""),"empty.pls","application/xml")}).value!;assert.equal(empty.version_rules_num,0);
 const prefixed=c.createFromFile({name:"Prefixed",file:upload('<p:lexicon xmlns:p="http://www.w3.org/2005/01/pronunciation-lexicon" version="1.0" alphabet="ipa"><p:lexeme><p:grapheme>word</p:grapheme><p:phoneme>pronunciation</p:phoneme></p:lexeme></p:lexicon>',"x.xml","text/xml")}).value!;assert.deepEqual(c.getDictionary(prefixed.id)!.rules,[{type:"phoneme",string_to_replace:"word",phoneme:"pronunciation",alphabet:"ipa"}]);
 await r.run(scenarios.reset);assert.equal(c.getDictionary(imported.id),undefined);
});

test("KB file context preserves canonical folders/dependents, invalidates RAG and replaces source URLs atomically",async()=>{
 const r=await createScenarioRunner();await r.run(scenarios.startup);const c=r.loadContext("/convai/knowledge-base");
 const source=upload("# Guide <one>\nCafé","guide.md","text/markdown"),doc=c.createFile({file:source,parent_folder_id:"sim-kb-folder",name:"Custom"});source.data.fill(0);
 const stored=c.getDocument(doc.id);assert.equal(stored.type,"file");assert.equal(c.getContent(doc.id),"# Guide &lt;one&gt;\nCafé");assert.equal(stored.metadata.size_bytes,Buffer.byteLength("# Guide <one>\nCafé"));assert.equal(stored.name,"Custom");assert.equal(stored.folder_path![0].id,"sim-kb-folder");
 const prompt=r.loadContext("/convai/agents").agents.get("sim-agent")!.configuration.conversation_config.agent!.prompt!;prompt.knowledge_base=[{id:doc.id,name:doc.name,type:"file"}];
 c.computeIndex(doc.id,{model:"e5_mistral_7b_instruct"});await r.run(scenarios.completeKnowledgeIndexes);const oldUrl=c.sourceFileUrl(doc.id).signed_url;
 const before=structuredClone([c.documents,c.indexes,c.sourceFileUrls]),counter=[c.nextId,c.nextMutation];
 for(const file of [upload("%PDF-1.0","x.pdf","application/pdf"),{...upload("x"),size:20},upload("\u0000"),{...upload("x"),data:new Uint8Array([255]),size:1},upload("x".repeat(1_048_577)),upload(" ")]){assert.throws(()=>c.createFile({file}));assert.throws(()=>c.updateFile(doc.id,{file}));}
 assert.throws(()=>c.createFile({file:upload("x"),parent_folder_id:"sim-kb-text"}),{status:400});assert.throws(()=>c.createFile({file:upload("x"),parent_folder_id:"missing"}),{status:404});
 assert.deepEqual([c.documents,c.indexes,c.sourceFileUrls],before);assert.deepEqual([c.nextId,c.nextMutation],counter);
 const updated=c.updateFile(doc.id,{file:upload("New <content>","new.txt")});assert.equal(updated.name,"new.txt");assert.equal(updated.folder_parent_id,"sim-kb-folder");assert.equal(updated.metadata.created_at_unix_secs,stored.metadata.created_at_unix_secs);assert.ok(updated.metadata.last_updated_at_unix_secs>stored.metadata.last_updated_at_unix_secs);assert.deepEqual(c.listIndexes(doc.id),{indexes:[]});assert.notEqual(c.sourceFileUrl(doc.id).signed_url,oldUrl);assert.equal(c.dependentAgents(doc.id)[0].id,"sim-agent");
 assert.equal(c.searchContent({query:"content",types:"file"}).results[0].document.id,doc.id);assert.throws(()=>c.updateFile("sim-kb-text",{file:upload("x")}),{status:400});assert.throws(()=>c.updateFile("missing",{file:upload("x")}),{status:404});assert.throws(()=>c.deleteDocument(doc.id,false),{status:409});c.deleteDocument(doc.id,true);assert.equal(c.sourceFileUrls.has(doc.id),false);assert.deepEqual(prompt.knowledge_base,[]);
 await r.run(scenarios.reset);assert.equal(c.documents.size,2);assert.equal(c.createFile({file:upload("x")}).id,doc.id);
});

test("validated document ingestion routes create/read/update and reject invalid sources with reset/isolation",async()=>{
 const h=await createDispatcherHarness();const send=async(path:string,body:Record<string,unknown>,status=200,method="POST")=>{const res=await h.requestMultipart(path,body,{method});assert.equal(res.status,status,await res.clone().text());return res;};
 const xml=await(await h.request("/v1/pronunciation-dictionaries/sim-dictionary/sim-dictionary-v1/download")).text();
 const dict=await(await send("/v1/pronunciation-dictionaries/add-from-file",{name:"Uploaded",file:upload(xml,"x.pls","application/pls+xml")})).json();assert.equal(dict.version_rules_num,2);assert.equal(await(await h.request(`/v1/pronunciation-dictionaries/${dict.id}/${dict.version_id}/download`)).text(),xml);
 await send("/v1/pronunciation-dictionaries/add-from-file",{name:"No source"},400);await send("/v1/pronunciation-dictionaries/add-from-file",{name:"Bad",file:upload("bad","x.pls","application/xml")},400);
 const doc=await(await send(`${base}/file`,{file:upload("Hello <file>"),parent_folder_id:"sim-kb-folder"})).json();const stored=await(await h.request(`${base}/${doc.id}`)).json();assert.equal(stored.type,"file");assert.equal(stored.extracted_inner_html,"Hello &lt;file&gt;");assert.equal(stored.filename,"guide.txt");
 assert.equal((await h.request(`${base}/${doc.id}/source-file-url`)).status,200);
 const changed=await(await send(`${base}/${doc.id}/update-file`,{file:upload("New content","new.md","text/markdown")},200,"PATCH")).json();assert.equal(changed.id,doc.id);assert.equal(changed.name,"new.md");assert.equal(changed.extracted_inner_html,"New content");
 const legacy=await(await send(base,{file:upload("legacy"),name:"Legacy"})).json();assert.equal((await(await h.request(`${base}/${legacy.id}`)).json()).type,"file");const url=await(await send(base,{url:"https://simulator.invalid/guide"})).json();assert.equal((await(await h.request(`${base}/${url.id}`)).json()).type,"url");
 for(const body of [{},{file:upload("x"),url:"https://simulator.invalid/guide"},{url:"https://unknown.invalid"}])await send(base,body,400);
 await send(`${base}?agent_id=sim-agent`,{file:upload("x")},400);await send(`${base}/file`,{},400);await send(`${base}/file`,{file:upload("%PDF","x.pdf","application/pdf")},400);await send(`${base}/sim-kb-text/update-file`,{file:upload("x")},400,"PATCH");await send(`${base}/missing/update-file`,{file:upload("x")},404,"PATCH");
 const other=await createDispatcherHarness();assert.equal((await other.request(`${base}/${doc.id}`)).status,404);await h.scenario("reset");assert.equal((await h.request(`${base}/${doc.id}`)).status,404);assert.equal((await(await h.request(base)).json()).documents.length,2);assert.equal((await h.request(`/v1/pronunciation-dictionaries/${dict.id}`)).status,404);
});
