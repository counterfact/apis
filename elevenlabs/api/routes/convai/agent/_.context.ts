import type { Context as KnowledgeContext } from "../knowledge-base/_.context.js";
export class Context {
  usage?: () => import("../llm-usage/_.context.js").Context;
  calculateUsage(id: string, body: unknown) {
    if (!this.usage) throw new Error("Run startup or reset");
    return this.usage().forAgent(id, body);
  }
  knowledgeBase?: () => KnowledgeContext;
  agentKnowledgeSize(id:string) {
    if(!this.knowledgeBase)throw new Error("Run knowledge base initialization scenario first");
    return this.knowledgeBase().agentKnowledgeSize(id);
  }
}
