import type { Context as Conversations } from "../conversations/_.context.js";
export class Context {
  conversations?:()=>Conversations;
  liveCount(query:Record<string,unknown>={}) {
    if(!this.conversations)throw new Error("Run startup or reset");
    return this.conversations().liveCount(query);
  }
}
