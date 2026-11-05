import type {Context as Credentials} from "../convai/conversation/_.context.js";
export class Context{
 credentials?:()=>Credentials;
 issue(type:unknown){if(!this.credentials)throw new Error("Run startup or reset");return this.credentials().singleUse(type);}
}
