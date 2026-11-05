import type { Scenario } from "../types/index.js";
export const emptyKnowledgeBase:Scenario=($)=>{
  const c=$.loadContext("/convai/knowledge-base");c.documents=new Map();c.nextId=1;c.nextMutation=0;c.indexes=new Map();c.nextIndexId=1;c.maxIndexBytes=1_000_000;
  c.defaults={userId:"sim-user",time:1_735_689_602,accessInfo:{is_creator:true,creator_name:"Simulator",creator_email:"sim@example.invalid",role:"admin",access_source:"creator"}};
  c.agents=()=>$.loadContext("/convai/agents").agents;
  $.loadContext("/convai/agent").knowledgeBase=()=>$.loadContext("/convai/knowledge-base");
};
export const resetKnowledgeBase:Scenario=($)=>{
  emptyKnowledgeBase($);const c=$.loadContext("/convai/knowledge-base");
  c.documents=new Map([
    ["sim-kb-folder",{creatorUserId:"sim-user",document:{id:"sim-kb-folder",name:"Simulator Documents",type:"folder",metadata:{created_at_unix_secs:1_735_689_600,last_updated_at_unix_secs:1_735_689_600,size_bytes:0},supported_usages:[],access_info:structuredClone(c.defaults!.accessInfo),folder_parent_id:null,children_count:1,document_count:1,auto_sync_info:null}}],
    ["sim-kb-text",{creatorUserId:"sim-user",document:{id:"sim-kb-text",name:"Simulator Guide",type:"text",metadata:{created_at_unix_secs:1_735_689_601,last_updated_at_unix_secs:1_735_689_601,size_bytes:15},supported_usages:["prompt","auto"],access_info:structuredClone(c.defaults!.accessInfo),folder_parent_id:"sim-kb-folder",extracted_inner_html:"Synthetic guide",content_format:"html"}}],
  ]);
  c.indexes=new Map([["sim-kb-text",new Map([["e5_mistral_7b_instruct",{index:{id:"sim-kb-index",model:"e5_mistral_7b_instruct",status:"succeeded",progress_percentage:100,document_model_index_usage:{used_bytes:15}},chunks:[{id:"sim-kb-chunk-1",name:"Simulator Guide",content:"Synthetic"},{id:"sim-kb-chunk-2",name:"Simulator Guide",content:"guide"}]}]])]]);
};
export const completeKnowledgeIndexes:Scenario=($)=>{
  const c=$.loadContext("/convai/knowledge-base");
  for(const [id,indexes]of c.indexes){const document=c.documents.get(id)?.document;if(document?.type!=="text")continue;
    for(const entry of indexes.values())if(entry.index.status==="created"){
      const content=document.extracted_inner_html.replaceAll("&lt;","<").replaceAll("&gt;",">").replaceAll("&quot;",'"').replaceAll("&#39;", "'").replaceAll("&amp;","&");
      entry.chunks=[{id:`${entry.index.id}-chunk-1`,name:document.name,content}];entry.index.status="succeeded";entry.index.progress_percentage=100;entry.index.document_model_index_usage.used_bytes=Buffer.byteLength(content,"utf8");
    }
  }
};
export const knowledgeBaseReferences:Scenario=($)=>{
  const agent=$.loadContext("/convai/agents").agents.get("sim-agent");if(!agent)throw new Error("Run reset before knowledgeBaseReferences");
  agent.configuration.conversation_config.agent!.prompt!.knowledge_base=[{id:"sim-kb-text",name:"Simulator Guide",type:"text",usage_mode:"auto"}];
};
