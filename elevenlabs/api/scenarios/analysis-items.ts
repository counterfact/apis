import type { Scenario } from "../types/index.js";
export const emptyAnalysisItems:Scenario=($)=>{
  const c=$.loadContext("/convai/analysis-items");
  const ownedIds=new Set(c.items.keys());
  c.items=new Map();c.nextId=1;c.nextMutation=0;
  c.agents=()=>$.loadContext("/convai/agents").agents;
  c.mainBranch=(agentId)=>$.loadContext("/convai/agents").agents.get(agentId)?.mainBranch;
  c.defaults={userId:"sim-user",time:1_735_689_602,accessInfo:{is_creator:true,creator_name:"Simulator",creator_email:"sim@example.invalid",role:"admin",access_source:"creator"}};
  for(const agent of c.agents().values()) {
    const refs=agent.configuration.platform_settings?.analysis_items;
    if(refs) {
      refs.evaluation_criteria=refs.evaluation_criteria?.filter(r=>r.source!=="user"||!ownedIds.has(r.analysis_item_id));
      refs.data_collection=refs.data_collection?.filter(r=>r.source!=="user"||!ownedIds.has(r.analysis_item_id));
    }
  }
};
export const resetAnalysisItems:Scenario=($)=>{
  emptyAnalysisItems($);const c=$.loadContext("/convai/analysis-items");
  const definitions=[{kind:"evaluation" as const,source:"user" as const,name:"Simulator Greeting",conversation_goal_prompt:"Did the agent greet the user?",use_knowledge_base:false,scoring:{mode:"binary" as const}},{kind:"data_collection" as const,source:"user" as const,name:"Simulator Topic",value_schema:{type:"string" as const,description:"Synthetic topic"}}];
  for(const [index,definition]of definitions.entries()){
    const id=index===0?"sim-analysis-evaluation":"sim-analysis-data",version=`${id}-v1`,time=1_735_689_600+index;
    c.items.set(id,{creatorUserId:"sim-user",item:{id,definition,access_info:structuredClone(c.defaults!.accessInfo),created_at_unix_secs:time,updated_at_unix_secs:time,current_version_id:version},versions:[{id:version,version_number:1,created_at_unix_secs:time,definition:structuredClone(definition)}]});
  }
};
