import type {Context as Communication} from "../whatsapp-accounts/_.context.js";
export class Context {
 communication?:()=>Communication;
 private shared(){if(!this.communication)throw new Error("Run startup or reset");return this.communication();}
 call(input:unknown){return this.shared().whatsapp(input,false);}
 message(input:unknown){return this.shared().whatsapp(input,true);}
}
