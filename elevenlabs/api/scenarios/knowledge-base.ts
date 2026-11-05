import type { Scenario } from "../types/index.js";
export const emptyKnowledgeBase:Scenario=($)=>{
  const c=$.loadContext("/convai/knowledge-base");c.documents=new Map();c.sourcePages=new Map();c.sourceFileUrls=new Map();c.crawls=new Map();c.ragQueries=new Map();c.nextCrawl=1;c.retrievalDefaults={model:"e5_mistral_7b_instruct",maxLength:50000,maxChunks:20,maxDistance:0.6};c.nextId=1;c.nextMutation=0;c.indexes=new Map();c.nextIndexId=1;c.maxIndexBytes=1_000_000;
  c.defaults={userId:"sim-user",time:1_735_689_602,accessInfo:{is_creator:true,creator_name:"Simulator",creator_email:"sim@example.invalid",role:"admin",access_source:"creator"}};
  c.agents=()=>$.loadContext("/convai/agents").agents;
  c.selectAgent=(id,branchId)=>{const agents=$.loadContext("/convai/agents");if(agents.lifecycle)return agents.lifecycle.select(id,{branch_id:branchId});const agent=agents.getAgent(id);if(!agent)throw Object.assign(new Error("Agent not found"),{name:"KnowledgeBaseError",status:404,code:"agent_not_found"});return agent;};
  $.loadContext("/convai/agents").knowledgeBase=()=>$.loadContext("/convai/knowledge-base");
  $.loadContext("/convai/agent").knowledgeBase=()=>$.loadContext("/convai/knowledge-base");
};
export const resetKnowledgeBase:Scenario=($)=>{
  emptyKnowledgeBase($);const c=$.loadContext("/convai/knowledge-base");
  c.sourcePages=new Map([["https://simulator.invalid/guide",{name:"Synthetic Source Guide",content:"Synthetic source guide"}],["https://simulator.invalid/guide/faq",{name:"Synthetic FAQ",content:"Synthetic source answers"}]]);
  c.documents=new Map([
    ["sim-kb-folder",{creatorUserId:"sim-user",document:{id:"sim-kb-folder",name:"Simulator Documents",type:"folder",metadata:{created_at_unix_secs:1_735_689_600,last_updated_at_unix_secs:1_735_689_600,size_bytes:0},supported_usages:[],access_info:structuredClone(c.defaults!.accessInfo),folder_parent_id:null,children_count:1,document_count:1,auto_sync_info:null}}],
    ["sim-kb-text",{creatorUserId:"sim-user",document:{id:"sim-kb-text",name:"Simulator Guide",type:"text",metadata:{created_at_unix_secs:1_735_689_601,last_updated_at_unix_secs:1_735_689_601,size_bytes:15},supported_usages:["prompt","auto"],access_info:structuredClone(c.defaults!.accessInfo),folder_parent_id:"sim-kb-folder",extracted_inner_html:"Synthetic guide",content_format:"html"}}],
  ]);
  c.indexes=new Map([["sim-kb-text",new Map([["e5_mistral_7b_instruct",{index:{id:"sim-kb-index",model:"e5_mistral_7b_instruct",status:"succeeded",progress_percentage:100,document_model_index_usage:{used_bytes:15}},chunks:[{id:"sim-kb-chunk-1",name:"Simulator Guide",content:"Synthetic"},{id:"sim-kb-chunk-2",name:"Simulator Guide",content:"guide"}]}]])]]);
};
export const completeKnowledgeIndexes:Scenario=($)=>{
  const c=$.loadContext("/convai/knowledge-base");
  for(const [id,indexes]of c.indexes){const document=c.documents.get(id)?.document;if(!document||document.type==="folder")continue;
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

export const knowledgeSourceRevision:Scenario=($)=>{
  $.loadContext("/convai/knowledge-base").sourcePages.set("https://simulator.invalid/guide",{name:"Synthetic Source Guide",content:"Revised source <guide>"});
};
export const knowledgeSourceFiles:Scenario=($)=>{
  const c=$.loadContext("/convai/knowledge-base");
  c.documents.set("sim-kb-file",{creatorUserId:"sim-user",document:{id:"sim-kb-file",name:"Synthetic source file",type:"file",filename:"synthetic-guide.txt",extracted_inner_html:"Synthetic file guide",content_format:"html",metadata:{created_at_unix_secs:1735689602,last_updated_at_unix_secs:1735689602,size_bytes:20},supported_usages:["prompt","auto"],access_info:structuredClone(c.defaults!.accessInfo),folder_parent_id:null}});
  c.sourceFileUrls.set("sim-kb-file","https://simulator.invalid/knowledge-base/source/sim-kb-file?token=synthetic-source-file");
};
export const completeKnowledgeCrawls:Scenario=($)=>{
  const c=$.loadContext("/convai/knowledge-base");
  for(const stored of c.crawls.values())if(stored.job.status==="queued"){
    if(!c.documents.has(stored.job.root_folder_id)){stored.job.status="failed";stored.job.pages_failed=stored.urls.length;stored.job.updated_at=c.defaults!.time+ ++c.nextMutation;continue;}
    for(const url of stored.urls){const page=c.sourcePages.get(url);if(!page){stored.job.pages_failed=(stored.job.pages_failed??0)+1;continue;}
      let id:string;do{id=`sim-kb-created-${c.nextId++}`;}while(c.documents.has(id));const time=c.defaults!.time+ ++c.nextMutation;
      const content=page.content.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;");
      c.documents.set(id,{creatorUserId:c.defaults!.userId,document:{id,name:page.name,type:"url",url,extracted_inner_html:content,content_format:"html",auto_sync_info:null,metadata:{created_at_unix_secs:time,last_updated_at_unix_secs:time,size_bytes:Buffer.byteLength(page.content,"utf8")},supported_usages:["prompt","auto"],access_info:structuredClone(c.defaults!.accessInfo),folder_parent_id:stored.job.root_folder_id}});
      stored.documentIds.push(id);stored.job.pages_scraped=(stored.job.pages_scraped??0)+1;
    }
    stored.job.status=stored.job.pages_failed?"failed":"succeeded";stored.job.updated_at=c.defaults!.time+ ++c.nextMutation;
  }
};
export const knowledgeSourceRetrieval:Scenario=($)=>{
  const c=$.loadContext("/convai/knowledge-base"),agent=$.loadContext("/convai/agents").agents.get("sim-agent")!;
  agent.configuration.conversation_config.agent!.prompt!.knowledge_base=[{id:"sim-kb-text",name:"Simulator Guide",type:"text",usage_mode:"auto"}];
  agent.configuration.conversation_config.agent!.prompt!.rag={enabled:true,embedding_model:"e5_mistral_7b_instruct",max_vector_distance:0.6,max_documents_length:50000,max_retrieved_rag_chunks_count:20};
  c.ragQueries=new Map([["guide",[{documentId:"sim-kb-text",chunkId:"sim-kb-chunk-1",model:"e5_mistral_7b_instruct",distance:0.4},{documentId:"sim-kb-text",chunkId:"sim-kb-chunk-2",model:"e5_mistral_7b_instruct",distance:0.1}]]]);
};
