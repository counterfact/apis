import { createHash } from "node:crypto";
import type { WorkspaceApiKeyResponseModel as Key } from "../../../types/v1/components/schemas/WorkspaceApiKeyResponseModel.js";
export class WorkspaceKeyError extends Error {
  override name="WorkspaceKeyError";
  constructor(public status:number,public code:string,message:string){super(message);}
}
const invalid=():never=>{throw new WorkspaceKeyError(400,"invalid_workspace_key_policy","Invalid workspace key policy or confirmation");};
export class Context {
  callers=new Map<string,string>();
  keys:()=>Key[]=()=>[];
  override:boolean|null=null;
  planDefault?:boolean;
  setPolicy(input:unknown){
    if(input===undefined)return {};
    if(input===null||typeof input!=="object"||Array.isArray(input))return invalid();
    const body=input as Record<string,unknown>;
    if(Object.keys(body).some(k=>k!=="third_party_disable_allowed")||body.third_party_disable_allowed!==undefined&&body.third_party_disable_allowed!==null&&typeof body.third_party_disable_allowed!=="boolean")return invalid();
    if(body.third_party_disable_allowed!==undefined)this.override=body.third_party_disable_allowed as boolean|null;
    return {};
  }
  disableSelf(confirmation:unknown,token:unknown){
    if(confirmation!=="self")return invalid();
    if(typeof token!=="string"||!token)throw new WorkspaceKeyError(401,"synthetic_caller_not_found","A known synthetic caller key is required");
    const id=this.callers.get(token);
    const hash=token.startsWith("sim-not-a-real-key-")?createHash("sha256").update(token).digest("hex"):undefined;
    const key=this.keys().find(k=>id!==undefined?k.key_id===id:hash!==undefined&&k.hashed_xi_api_key===hash);
    if(!key)throw new WorkspaceKeyError(401,"synthetic_caller_not_found","A known synthetic caller key is required");
    const allowed=this.override??key.third_party_disable_allowed??this.planDefault;
    if(allowed===undefined)throw new Error("Run workspace key policy initialization scenario first");
    if(!allowed)throw new WorkspaceKeyError(403,"third_party_disabling_forbidden","Workspace or key policy forbids holder disabling");
    key.is_disabled=true;key.disable_reason="self_disabled";return {};
  }
}
