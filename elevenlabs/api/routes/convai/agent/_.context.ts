import type { Context as KnowledgeContext } from "../knowledge-base/_.context.js";
export class Context {
  knowledgeBase?: () => KnowledgeContext;
  agentKnowledgeSize(id:string) {
    if(!this.knowledgeBase)throw new Error("Run knowledge base initialization scenario first");
    return this.knowledgeBase().agentKnowledgeSize(id);
  }
}
