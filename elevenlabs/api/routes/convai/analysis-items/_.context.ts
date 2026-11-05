import { isDeepStrictEqual } from "node:util";
import type { AnalysisItemResponseModel as Item } from "../../../types/v1/components/schemas/AnalysisItemResponseModel.js";
import type { AnalysisItemVersionResponseModel as Version } from "../../../types/v1/components/schemas/AnalysisItemVersionResponseModel.js";
import type { UpdateAnalysisItemAttachmentsResponseModel as Attachments } from "../../../types/v1/components/schemas/UpdateAnalysisItemAttachmentsResponseModel.js";
import type { GetAnalysisItemDependentAgentsResponseModel as Dependencies } from "../../../types/v1/components/schemas/GetAnalysisItemDependentAgentsResponseModel.js";
import type { StoredAgent } from "../agents/_.context.js";
type Definition = Item["definition"];
type Stored = { item: Item; versions: Version[]; creatorUserId: string };
const object = (v: unknown): v is Record<string,unknown> => !!v && typeof v === "object" && !Array.isArray(v);
export class AnalysisItemError extends Error {
  override name="AnalysisItemError";
  constructor(public status:number, public code:string,message:string){super(message);}
}
const invalid = (): never => {throw new AnalysisItemError(400,"invalid_analysis_item_request","Invalid analysis item request");};
const array = (v:unknown): string[]|null => v==null?null:typeof v==="string"?[v]:Array.isArray(v)&&v.every(x=>typeof x==="string")?v:invalid();
export class Context {
  items = new Map<string,Stored>();
  mainBranches = new Map<string,{id:string;name:string}>();
  agents:()=>Map<string,StoredAgent> = ()=>new Map();
  nextId=1;
  nextMutation=0;
  defaults?: {userId:string;time:number;accessInfo:Item["access_info"]};
  private settings(){if(!this.defaults)throw new Error("Run analysis initialization scenario first");return this.defaults;}
  private stored(id:string){const r=this.items.get(id);if(!r)throw new AnalysisItemError(404,"analysis_item_not_found","Analysis item not found");return r;}
  private definition(input:unknown):Definition {
    if(!object(input)||typeof input.name!=="string"||!input.name.trim()||input.source!=null&&input.source!=="user")return invalid();
    const kind=input.kind ?? ("value_schema" in input?"data_collection":"evaluation");
    const keys=kind==="evaluation"?["name","source","kind","llm","conversation_goal_prompt","use_knowledge_base","scoring"]:["name","source","kind","llm","value_schema"];
    if(Object.keys(input).some(k=>!keys.includes(k))||input.llm!=null&&typeof input.llm!=="string")return invalid();
    if(kind==="evaluation") {
      if(typeof input.conversation_goal_prompt!=="string"||input.conversation_goal_prompt.length>2000||input.use_knowledge_base!==undefined&&typeof input.use_knowledge_base!=="boolean")return invalid();
      if(input.scoring!==undefined&&(!object(input.scoring)||!["binary","numeric_uniform"].includes(input.scoring.mode as string)||input.scoring.mode==="numeric_uniform"&&!Number.isSafeInteger(input.scoring.max_score)))return invalid();
      return structuredClone({...input,kind,source:"user",use_knowledge_base:input.use_knowledge_base??false,scoring:input.scoring??{mode:"binary"}}) as Definition;
    }
    if(kind!=="data_collection"||!object(input.value_schema))return invalid();
    const type=input.value_schema.type;
    if(typeof type==="string"?!["boolean","string","integer","number"].includes(type):!Array.isArray(type)||type.length!==2||type.some(t=>typeof t!=="string"))return invalid();
    return structuredClone({...input,kind,source:"user"}) as Definition;
  }
  private page(query:Record<string,unknown>={}) {
    const value=query.page_size ?? 30;
    const size=typeof value==="string"&&/^\d+$/.test(value)?Number(value):value;
    if(typeof size!=="number"||!Number.isSafeInteger(size)||size<1||size>100||query.cursor!=null&&(typeof query.cursor!=="string"||!/^\d+$/.test(query.cursor)))return invalid();
    const offset=Number(query.cursor??0);if(!Number.isSafeInteger(offset))return invalid();
    return {size,offset};
  }
  private paginate<T>(values:T[],query:Record<string,unknown>={}) {
    const {size,offset}=this.page(query),has_more=offset+size<values.length;
    return {values:structuredClone(values.slice(offset,offset+size)),has_more,next_cursor:has_more?String(offset+size):null};
  }
  getItem(id:string){return structuredClone(this.stored(id).item);}
  createItem(input:unknown){
    const definition=this.definition(input),settings=this.settings(),n=this.nextId++;
    const id=`sim-analysis-created-${n}`,time=settings.time+ ++this.nextMutation,version_id=`${id}-v1`;
    const item:Item={id,definition,access_info:structuredClone(settings.accessInfo),created_at_unix_secs:time,updated_at_unix_secs:time,current_version_id:version_id};
    this.items.set(id,{item,creatorUserId:settings.userId,versions:[{id:version_id,version_number:1,created_at_unix_secs:time,definition:structuredClone(definition)}]});
    return structuredClone(item);
  }
  updateItem(id:string,input:unknown){
    const stored=this.stored(id),definition=this.definition(input);
    if(definition.kind!==stored.item.definition.kind)return invalid();
    if(!isDeepStrictEqual(definition,stored.item.definition)){
      const n=stored.versions.length+1,time=this.settings().time+ ++this.nextMutation,version_id=`${id}-v${n}`;
      stored.item={...stored.item,definition,updated_at_unix_secs:time,current_version_id:version_id};
      stored.versions.push({id:version_id,version_number:n,created_at_unix_secs:time,definition:structuredClone(definition)});
    }
    return structuredClone(stored.item);
  }
  copyItem(id:string){return this.createItem(this.stored(id).item.definition);}
  listItems(query:Record<string,unknown>={}){
    if(query.kind!=null&&!["evaluation","data_collection"].includes(query.kind as string)||query.search!=null&&(typeof query.search!=="string"||query.search.length>100)||query.sort_direction!=null&&!["asc","desc"].includes(query.sort_direction as string)||query.created_by_user_id!=null&&typeof query.created_by_user_id!=="string")return invalid();
    const ids=array(query.analysis_item_ids);if(ids&&(ids.length<1||ids.length>100))return invalid();
    const creator=query.created_by_user_id==="@me"?this.settings().userId:query.created_by_user_id;
    const search=(query.search as string|undefined)?.toLowerCase();
    const values=[...this.items.values()].filter(r=>(!ids||ids.includes(r.item.id))&&(!query.kind||r.item.definition.kind===query.kind)&&(!creator||r.creatorUserId===creator)&&(!search||r.item.definition.name.toLowerCase().startsWith(search)))
      .sort((a,b)=>search?a.item.definition.name.localeCompare(b.item.definition.name)||a.item.id.localeCompare(b.item.id):(query.sort_direction==="asc"?1:-1)*(a.item.created_at_unix_secs-b.item.created_at_unix_secs)||a.item.id.localeCompare(b.item.id));
    const page=this.paginate(values.map(r=>r.item),query);return {analysis_items:page.values,has_more:page.has_more,next_cursor:page.next_cursor};
  }
  listVersions(id:string,query:Record<string,unknown>={}){const r=this.stored(id),page=this.paginate([...r.versions].reverse(),query);return {versions:page.values,current_version_id:r.item.current_version_id,has_more:page.has_more,next_cursor:page.next_cursor};}
  private refs(agent:StoredAgent){return agent.configuration.platform_settings?.analysis_items;}
  private dependencies(id:string){return [...this.agents()].filter(([,agent])=>{const refs=this.refs(agent);return [...refs?.evaluation_criteria??[],...refs?.data_collection??[]].some(r=>r.source==="user"&&r.analysis_item_id===id);}).sort(([a],[b])=>a.localeCompare(b));}
  dependentAgents(id:string,query:Record<string,unknown>={}):Dependencies {
    this.stored(id);const page=this.paginate(this.dependencies(id).map(([id,a])=>({id,name:a.configuration.name,created_at_unix_secs:a.configuration.metadata.created_at_unix_secs,access_level:"admin" as const,type:"available" as const})),query);
    return {agents:page.values,branches:page.values.flatMap(a=>{const b=this.mainBranches.get(a.id);return b?[{agent_id:a.id,agent_name:a.name,branch_id:b.id,branch_name:b.name,is_main:true}]:[];}),has_more:page.has_more,next_cursor:page.next_cursor};
  }
  deleteItem(id:string,force:boolean){
    this.stored(id);if(typeof force!=="boolean")return invalid();
    const dependencies=this.dependencies(id);if(dependencies.length&&!force)throw new AnalysisItemError(409,"analysis_item_in_use","Analysis item is referenced by agents");
    for(const [,a] of dependencies){const refs=this.refs(a)!;refs.evaluation_criteria=refs.evaluation_criteria?.filter(r=>r.source!=="user"||r.analysis_item_id!==id);refs.data_collection=refs.data_collection?.filter(r=>r.source!=="user"||r.analysis_item_id!==id);}
    this.items.delete(id);return {};
  }
  updateAttachments(id:string,input:unknown):Attachments{
    const item=this.stored(id).item;
    if(!object(input)||input.source!=="user"||Object.keys(input).some(k=>!["source","attach","detach"].includes(k)))return invalid();
    for(const key of ["attach","detach"])if(input[key]!==undefined&&(!Array.isArray(input[key])||input[key].some(d=>!object(d)||typeof d.agent_id!=="string"||typeof d.branch_id!=="string")))return invalid();
    const results:Attachments["results"]=[];
    for(const action of ["attach","detach"] as const)for(const dest of (input[action]??[]) as {agent_id:string;branch_id:string}[]){
      const agent=this.agents().get(dest.agent_id),branch=this.mainBranches.get(dest.agent_id);
      if(!agent||!branch||branch.id!==dest.branch_id){results.push({status:"failure",error_code:404,error_status:!agent?"agent_not_found":"branch_not_found",error_message:"Known agent main branch not found"});continue;}
      agent.configuration.platform_settings??={};const refs=agent.configuration.platform_settings.analysis_items??={};
      const key=item.definition.kind==="evaluation"?"evaluation_criteria":"data_collection";
      const current=refs[key]??[],exists=current.some(r=>r.source==="user"&&r.analysis_item_id===id);
      if(key==="evaluation_criteria") {
        if(action==="attach"&&!exists)refs.evaluation_criteria=[...refs.evaluation_criteria??[],{source:"user",analysis_item_id:id}];
        if(action==="detach"&&exists)refs.evaluation_criteria=refs.evaluation_criteria?.filter(r=>r.source!=="user"||r.analysis_item_id!==id);
      } else {
        if(action==="attach"&&!exists)refs.data_collection=[...refs.data_collection??[],{source:"user",analysis_item_id:id}];
        if(action==="detach"&&exists)refs.data_collection=refs.data_collection?.filter(r=>r.source!=="user"||r.analysis_item_id!==id);
      }
      results.push({status:"success",data:{...dest,action,changed:action==="attach"?!exists:exists}});
    }
    return {results};
  }
}
