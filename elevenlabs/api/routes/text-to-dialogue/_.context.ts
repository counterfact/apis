import type {Context as Rendering} from "../text-to-speech/_.context.js";
export class Context {rendering?:()=>Rendering;dialogue(body:unknown,query:Record<string,unknown>={}){if(!this.rendering)throw new Error("Run startup or reset");return this.rendering().dialogue(body,query);}}
