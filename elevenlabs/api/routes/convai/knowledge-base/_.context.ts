import type { RAGDocumentIndexResponseModel as Index } from "../../../types/v1/components/schemas/RAGDocumentIndexResponseModel.js";
import type { KnowledgeBaseDocumentChunkResponseModel as Chunk } from "../../../types/v1/components/schemas/KnowledgeBaseDocumentChunkResponseModel.js";
import type { GetKnowledgeBaseTextResponseModel as Text } from "../../../types/v1/components/schemas/GetKnowledgeBaseTextResponseModel.js";
import type { GetKnowledgeBaseFolderResponseModel as Folder } from "../../../types/v1/components/schemas/GetKnowledgeBaseFolderResponseModel.js";
import type { GetKnowledgeBaseSummaryTextResponseModel as TextSummary } from "../../../types/v1/components/schemas/GetKnowledgeBaseSummaryTextResponseModel.js";
import type { GetKnowledgeBaseSummaryFolderResponseModel as FolderSummary } from "../../../types/v1/components/schemas/GetKnowledgeBaseSummaryFolderResponseModel.js";
import type { StoredAgent } from "../agents/_.context.js";
export type Document=Text|Folder;
export type StoredDocument={document:Document;creatorUserId:string};
const html=(value:string)=>value.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;");
const object=(v:unknown):v is Record<string,unknown>=>!!v&&typeof v==="object"&&!Array.isArray(v);
export class KnowledgeBaseError extends Error {
  override name="KnowledgeBaseError";
  constructor(public status:number,public code:string,message:string){super(message);}
}
const invalid=():never=>{throw new KnowledgeBaseError(400,"invalid_knowledge_base_request","Invalid knowledge base request");};
export class Context {
  documents=new Map<string,StoredDocument>();
  indexes=new Map<string,Map<Index["model"],{index:Index;chunks:Chunk[]}>>();
  nextIndexId=1;
  maxIndexBytes=0;
  agents:()=>Map<string,StoredAgent>=()=>new Map();
  nextId=1;
  nextMutation=0;
  defaults?:{userId:string;time:number;accessInfo:Text["access_info"]};
  private settings(){if(!this.defaults)throw new Error("Run knowledge base initialization scenario first");return this.defaults;}
  private stored(id:string){const r=this.documents.get(id);if(!r)throw new KnowledgeBaseError(404,"knowledge_base_document_not_found","Knowledge base document not found");return r;}
  private name(v:unknown){if(typeof v!=="string"||!v.trim())return invalid();return v;}
  private parent(v:unknown){if(v==null)return null;if(typeof v!=="string")return invalid();if(this.stored(v).document.type!=="folder")return invalid();return v;}
  private unsupportedSync(input:Record<string,unknown>){
    if(input.enable_auto_sync!=null&&input.enable_auto_sync!==false||input.auto_remove!=null&&input.auto_remove!==false||input.minimum_frequency_days!=null||input.tighten_only!=null&&input.tighten_only!==false)
      throw new KnowledgeBaseError(400,"knowledge_base_auto_sync_unsupported","Local documents do not support automatic synchronization");
  }
  folderPath(id:string){const path:{id:string;name:string}[]=[];let current=this.stored(id).document.folder_parent_id;const visited=new Set<string>();
    while(current){if(visited.has(current))throw new Error("Knowledge base folder cycle");visited.add(current);const d=this.stored(current).document;path.unshift({id:d.id,name:d.name});current=d.folder_parent_id;}return path;}
  private descendants(id:string){return [...this.documents.keys()].filter(k=>k!==id&&this.folderPath(k).some(p=>p.id===id));}
  private refs(agent:StoredAgent){return agent.configuration.conversation_config.agent?.prompt?.knowledge_base??[];}
  dependentAgents(id:string,mode:"direct"|"transitive"|"all"="all"){
    const ancestors=new Set(this.folderPath(id).map(p=>p.id));
    return [...this.agents()].filter(([,a])=>this.refs(a).some(r=>mode!=="transitive"&&r.id===id||mode!=="direct"&&ancestors.has(r.id))).sort(([a],[b])=>a.localeCompare(b)).map(([id,a])=>({type:"available" as const,id,name:a.configuration.name,created_at_unix_secs:a.configuration.metadata.created_at_unix_secs,access_level:"admin" as const}));
  }
  getDocument(id:string):Document {
    const d=structuredClone(this.stored(id).document);d.folder_path=this.folderPath(id);
    if(d.type==="folder"){d.children_count=[...this.documents.values()].filter(r=>r.document.folder_parent_id===id).length;d.document_count=Math.min(1000,this.descendants(id).filter(k=>this.stored(k).document.type!=="folder").length);}return d;
  }
  getContent(id:string){const d=this.stored(id).document;if(d.type!=="text")return invalid();return d.extracted_inner_html;}
  summary(id:string):TextSummary|FolderSummary {const d=this.getDocument(id);const {extracted_inner_html:_content,content_format:_format,...base}=d as Text;return {...base,dependent_agents:this.dependentAgents(id)} as TextSummary|FolderSummary;}
  summaries(ids:unknown){const values=typeof ids==="string"?[ids]:ids;if(!Array.isArray(values)||values.length<1||values.length>100||values.some(v=>typeof v!=="string"))return invalid();return Object.fromEntries([...new Set(values as string[])].map(id=>[id,this.documents.has(id)?{status:"success" as const,data:this.summary(id)}:{status:"failure" as const,error_code:404,error_status:"knowledge_base_document_not_found",error_message:"Knowledge base document not found"}]));}
  private create(input:unknown,kind:"text"|"folder"){
    if(!object(input)||Object.keys(input).some(k=>!(kind==="text"?["text","name","parent_folder_id"]:["name","parent_folder_id","enable_auto_sync","auto_remove","minimum_frequency_days"]).includes(k)))return invalid();
    if(kind==="text"&&typeof input.text!=="string")return invalid();this.unsupportedSync(input);
    const parent=this.parent(input.parent_folder_id),name=kind==="text"&&input.name==null?"Untitled text document":this.name(input.name),settings=this.settings(),n=this.nextId++;
    const time=settings.time+ ++this.nextMutation,id=`sim-kb-created-${n}`;
    const common={id,name,metadata:{created_at_unix_secs:time,last_updated_at_unix_secs:time,size_bytes:kind==="text"?Buffer.byteLength(input.text as string,"utf8"):0},supported_usages:kind==="text"?["prompt" as const,"auto" as const]:[],access_info:structuredClone(settings.accessInfo),folder_parent_id:parent,folder_path:[]};
    const document:Document=kind==="text"?{...common,type:"text",extracted_inner_html:html(input.text as string),content_format:"html"}:{...common,type:"folder",children_count:0,document_count:0,auto_sync_info:null};
    this.documents.set(id,{document,creatorUserId:settings.userId});return {id,name,folder_path:this.folderPath(id)};
  }
  createText(input:unknown){return this.create(input,"text");}
  createFolder(input:unknown){return this.create(input,"folder");}
  updateDocument(id:string,input:unknown){
    const d=this.stored(id).document;if(!object(input)||Object.keys(input).some(k=>!["name","content","enable_auto_sync","auto_remove","minimum_frequency_days","tighten_only"].includes(k)))return invalid();
    this.unsupportedSync(input);const name=input.name==null?d.name:this.name(input.name);
    if(input.content!=null&&(typeof input.content!=="string"||d.type!=="text"))return invalid();
    const content=input.content==null?undefined:html(input.content as string);
    if(name!==d.name||content!==undefined&&d.type==="text"&&content!==d.extracted_inner_html){d.name=name;if(content!==undefined&&d.type==="text"){if(content!==d.extracted_inner_html)this.indexes.delete(id);d.extracted_inner_html=content;d.metadata.size_bytes=Buffer.byteLength(input.content as string,"utf8");}d.metadata.last_updated_at_unix_secs=this.settings().time+ ++this.nextMutation;}
    return this.getDocument(id);
  }
  private deletionIds(id:string,force:boolean){
    this.stored(id);if(typeof force!=="boolean")return invalid();const ids=[id,...this.descendants(id)];
    if(!force&&(ids.length>1||ids.some(k=>this.dependentAgents(k).length)))throw new KnowledgeBaseError(409,"knowledge_base_document_in_use","Document is referenced or folder is not empty");
    return ids;
  }
  deleteDocument(id:string,force:boolean){
    const ids=this.deletionIds(id,force);
    const removed=new Set(ids);for(const a of this.agents().values()){const prompt=a.configuration.conversation_config.agent?.prompt;if(prompt?.knowledge_base)prompt.knowledge_base=prompt.knowledge_base.filter(r=>!removed.has(r.id));}
    for(const k of ids){this.documents.delete(k);this.indexes.delete(k);}return {};
  }
  private documentIds(value:unknown):string[]{
    if(!Array.isArray(value)||value.length<1||value.length>20||value.some(id=>typeof id!=="string")||new Set(value).size!==value.length)return invalid();
    return value as string[];
  }
  moveDocument(id:string,input:unknown){
    if(!object(input)||Object.keys(input).some(k=>k!=="move_to"))return invalid();
    this.moveDocuments({document_ids:[id],move_to:input.move_to});
  }
  moveDocuments(input:unknown){
    if(!object(input)||Object.keys(input).some(k=>!["document_ids","move_to"].includes(k)))return invalid();
    const ids=this.documentIds(input.document_ids),destination=this.parent(input.move_to);
    const documents=ids.map(id=>this.stored(id).document);
    if(destination&&documents.some(d=>d.id===destination||this.folderPath(destination).some(p=>p.id===d.id)))return invalid();
    const changed=documents.filter(d=>d.folder_parent_id!==destination);
    if(!changed.length)return;
    const time=this.settings().time+ ++this.nextMutation;
    for(const d of changed){d.folder_parent_id=destination;d.metadata.last_updated_at_unix_secs=time;}
  }
  bulkDelete(input:unknown){
    if(!object(input)||Object.keys(input).some(k=>!["document_ids","force"].includes(k)))return invalid();
    const ids=this.documentIds(input.document_ids),force=input.force??false;if(typeof force!=="boolean")return invalid();
    const outcomes=ids.map(id=>{
      try{this.deletionIds(id,force);return [id,{status:"success" as const,data:{id}}] as const;}
      catch(error){if(!(error instanceof Error)||error.name!=="KnowledgeBaseError")throw error;const e=error as KnowledgeBaseError;return [id,{status:"failure" as const,error_code:e.status,error_status:e.code,error_message:e.message}] as const;}
    });
    for(const[id,result]of outcomes)if(result.status==="success"&&this.documents.has(id))this.deleteDocument(id,force);
    return Object.fromEntries(outcomes);
  }
  listDependentAgents(ids:unknown,query:Record<string,unknown>={}){
    const values=this.documentIds(ids);for(const id of values)this.stored(id);
    const mode=query.dependent_type??"all",size=query.page_size??30;
    if(!["all","direct","transitive"].includes(mode as string)||typeof size!=="number"||!Number.isSafeInteger(size)||size<1||size>100||query.cursor!=null&&(typeof query.cursor!=="string"||!/^\d+$/.test(query.cursor)))return invalid();
    const offset=Number(query.cursor??0);if(!Number.isSafeInteger(offset))return invalid();
    const agents=[...new Map(values.flatMap(id=>this.dependentAgents(id,mode as "all"|"direct"|"transitive")).map(a=>[a.id,a])).values()].sort((a,b)=>a.id.localeCompare(b.id));
    const has_more=offset+size<agents.length;
    return {agents:agents.slice(offset,offset+size),branches:[],has_more,next_cursor:has_more?String(offset+size):null};
  }
  agentKnowledgeSize(id:string){
    const agent=this.agents().get(id);if(!agent)throw new KnowledgeBaseError(404,"agent_not_found","Agent not found");
    const pages=new Set<string>();
    for(const ref of this.refs(agent)){
      const d=this.stored(ref.id).document;
      for(const key of d.type==="folder"?this.descendants(d.id):[d.id])if(this.stored(key).document.type==="text")pages.add(key);
    }
    return {number_of_pages:pages.size};
  }
  private model(value:unknown):Index["model"] {
    if(value!=="e5_mistral_7b_instruct"&&value!=="multilingual_e5_large_instruct")return invalid();return value;
  }
  private indexPage(query:Record<string,unknown>){
    const size=query.page_size??30;if(typeof size!=="number"||!Number.isSafeInteger(size)||size<1||size>100||query.cursor!=null&&(typeof query.cursor!=="string"||!/^\d+$/.test(query.cursor)))return invalid();
    const offset=Number(query.cursor??0);if(!Number.isSafeInteger(offset))return invalid();return {size,offset};
  }
  listIndexes(id:string){this.stored(id);return {indexes:structuredClone([...(this.indexes.get(id)?.values()??[])].map(r=>r.index).sort((a,b)=>a.model.localeCompare(b.model)))};}
  computeIndex(id:string,input:unknown){
    const document=this.stored(id).document;if(!object(input)||Object.keys(input).some(k=>k!=="model"))return invalid();const model=this.model(input.model);
    const existing=this.indexes.get(id)?.get(model);if(existing)return structuredClone(existing.index);
    const index:Index={id:`sim-kb-index-created-${this.nextIndexId++}`,model,status:document.type==="folder"?"cannot_index_folder":"created",progress_percentage:0,document_model_index_usage:{used_bytes:0}};
    let indexes=this.indexes.get(id);if(!indexes){indexes=new Map();this.indexes.set(id,indexes);}indexes.set(model,{index,chunks:[]});return structuredClone(index);
  }
  deleteIndex(id:string,indexId:string){
    this.stored(id);const indexes=this.indexes.get(id),entry=[...(indexes??[])].find(([,r])=>r.index.id===indexId);
    if(!entry)throw new KnowledgeBaseError(404,"knowledge_base_index_not_found","Knowledge base index not found");
    indexes!.delete(entry[0]);if(!indexes!.size)this.indexes.delete(id);return structuredClone(entry[1].index);
  }
  batchIndexes(input:unknown){
    if(!object(input)||Object.keys(input).some(k=>k!=="items")||!Array.isArray(input.items)||input.items.length<1||input.items.length>100)return invalid();
    const ids=new Set<string>();
    for(const item of input.items){if(!object(item)||Object.keys(item).some(k=>!["document_id","model","create_if_missing"].includes(k))||typeof item.document_id!=="string"||typeof item.create_if_missing!=="boolean"||ids.has(item.document_id))return invalid();this.model(item.model);ids.add(item.document_id);}
    return Object.fromEntries(input.items.map(item=>{
      const request=item as {document_id:string;model:Index["model"];create_if_missing:boolean};
      try{this.stored(request.document_id);const existing=this.indexes.get(request.document_id)?.get(request.model);if(!existing&&!request.create_if_missing)throw new KnowledgeBaseError(404,"knowledge_base_index_not_found","Knowledge base index not found");
        return [request.document_id,{status:"success" as const,data:existing?structuredClone(existing.index):this.computeIndex(request.document_id,{model:request.model})}];
      }catch(error){if(!(error instanceof Error)||error.name!=="KnowledgeBaseError")throw error;const e=error as KnowledgeBaseError;return [request.document_id,{status:"failure" as const,error_code:e.status,error_status:e.code,error_message:e.message}];}
    }));
  }
  ragOverview(){
    const models:Index["model"][]=["e5_mistral_7b_instruct","multilingual_e5_large_instruct"];
    const usage=models.map(model=>({model,used_bytes:[...this.indexes.values()].reduce((n,indexes)=>n+(indexes.get(model)?.index.document_model_index_usage.used_bytes??0),0)}));
    return {total_used_bytes:usage.reduce((n,m)=>n+m.used_bytes,0),total_max_bytes:this.maxIndexBytes,models:usage};
  }
  listChunks(id:string,query:Record<string,unknown>){
    this.stored(id);const model=this.model(query.embedding_model),{size,offset}=this.indexPage(query),chunks=this.indexes.get(id)?.get(model)?.chunks??[];
    return {chunks:structuredClone(chunks.slice(offset,offset+size)),next_cursor:offset+size<chunks.length?String(offset+size):null};
  }
  getChunk(id:string,chunkId:string,model?:unknown){
    this.stored(id);const selected=this.model(model??"e5_mistral_7b_instruct"),chunk=this.indexes.get(id)?.get(selected)?.chunks.find(c=>c.id===chunkId);
    if(!chunk)throw new KnowledgeBaseError(404,"knowledge_base_chunk_not_found","Knowledge base chunk not found");return structuredClone(chunk);
  }
  searchContent(query:Record<string,unknown>){
    const {size,offset}=this.indexPage(query);if(typeof query.query!=="string"||!query.query.trim())return invalid();
    const types=query.types==null?null:typeof query.types==="string"?[query.types]:query.types;if(types!==null&&(!Array.isArray(types)||types.some(v=>!["text","folder","file","url"].includes(v))))return invalid();
    const tokens=query.query.toLowerCase().match(/[\p{L}\p{N}]+/gu)??[];if(!tokens.length)return invalid();
    const oneEdit=(a:string,b:string)=>{if(Math.abs(a.length-b.length)>1)return false;let i=0,j=0,edits=0;while(i<a.length&&j<b.length){if(a[i]===b[j]){i++;j++;continue;}if(++edits>1)return false;if(a.length<=b.length)j++;if(a.length>=b.length)i++;}return edits+(i<a.length||j<b.length?1:0)<=1;};
    const results=[...this.documents.values()].flatMap(r=>{
      if(r.document.type!=="text"||types&&!(types as string[]).includes("text"))return [];
      const content=r.document.extracted_inner_html.replaceAll("&lt;","<").replaceAll("&gt;",">").replaceAll("&quot;",'"').replaceAll("&#39;", "'").replaceAll("&amp;","&");
      const words:string[]=content.toLowerCase().match(/[\p{L}\p{N}]+/gu)??[];
      const score=tokens.reduce((sum,t)=>sum+(words.includes(t)?1:t.length>=4&&words.some(w=>oneEdit(t,w))?0.75:0),0)/tokens.length;
      return score?[{document:this.summary(r.document.id),search_snippet:null,score}]:[];
    }).sort((a,b)=>b.score-a.score||a.document.id.localeCompare(b.document.id));
    return {results:results.slice(offset,offset+size),next_cursor:offset+size<results.length?String(offset+size):null};
  }
  listDocuments(query:Record<string,unknown>={}){
    const size=query.page_size??30;if(typeof size!=="number"||!Number.isSafeInteger(size)||size<1||size>100||query.cursor!=null&&(typeof query.cursor!=="string"||!/^\d+$/.test(query.cursor)))return invalid();
    const offset=Number(query.cursor??0);if(!Number.isSafeInteger(offset))return invalid();
    for(const k of ["search","created_by_user_id","parent_folder_id","ancestor_folder_id"])if(query[k]!=null&&typeof query[k]!=="string")return invalid();
    for(const k of ["show_only_owned_documents","folders_first"])if(query[k]!=null&&typeof query[k]!=="boolean")return invalid();
    const direction=query.sort_direction??"desc",sort=query.sort_by??"created_at";if(!["asc","desc"].includes(direction as string)||!["name","created_at","updated_at","size"].includes(sort as string))return invalid();
    const types=query.types==null?null:typeof query.types==="string"?[query.types]:query.types;if(types!==null&&(!Array.isArray(types)||types.some(v=>!["text","folder","file","url"].includes(v))))return invalid();
    const creator=query.created_by_user_id==="@me"?this.settings().userId:query.created_by_user_id??(query.show_only_owned_documents?this.settings().userId:null);
    const values=[...this.documents.values()].filter(r=>(!types||(types as string[]).includes(r.document.type))&&(!creator||r.creatorUserId===creator)&&(query.search==null||r.document.name.toLowerCase().startsWith((query.search as string).toLowerCase()))&&(query.parent_folder_id==null||r.document.folder_parent_id===query.parent_folder_id)&&(query.ancestor_folder_id==null||this.folderPath(r.document.id).some(p=>p.id===query.ancestor_folder_id)));
    const value=(d:Document)=>sort==="name"?d.name:sort==="size"?d.metadata.size_bytes:sort==="updated_at"?d.metadata.last_updated_at_unix_secs:d.metadata.created_at_unix_secs;
    values.sort((a,b)=>{if(query.folders_first&&a.document.type!==b.document.type){if(a.document.type==="folder")return -1;if(b.document.type==="folder")return 1;}const av=value(a.document),bv=value(b.document),cmp=typeof av==="string"?av.localeCompare(bv as string):(av as number)-(bv as number);return (direction==="asc"?1:-1)*cmp||a.document.id.localeCompare(b.document.id);});
    const has_more=offset+size<values.length;return {documents:values.slice(offset,offset+size).map(r=>this.summary(r.document.id)),has_more,next_cursor:has_more?String(offset+size):null};
  }
}
