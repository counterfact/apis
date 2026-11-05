import type {Context as Communication} from "../whatsapp-accounts/_.context.js";
export class Context {
 communication?:()=>Communication;
 private shared(){if(!this.communication)throw new Error("Run startup or reset");return this.communication();}
 outbound(input:unknown){return this.shared().outbound("twilio",input);}
 register(input:unknown){return this.shared().register(input);}
}
