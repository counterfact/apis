import type { RealtimeConversationGroupResponseModel as Group } from "../../../types/v1/components/schemas/RealtimeConversationGroupResponseModel.js";
export class RealtimeGroupError extends Error {
  override name = "RealtimeGroupError";
  constructor(public status: number, public code: string, message: string) { super(message); }
}
const invalid = (): never => { throw new RealtimeGroupError(400,"invalid_realtime_group_request","Invalid realtime group request"); };
const object = (v:unknown): v is Record<string,unknown> => !!v && typeof v === "object" && !Array.isArray(v);
export class Context {
  groups = new Map<string,Group>();
  /** Known synthetic realtime conversations and their current group, if any. */
  conversations = new Map<string,string|null>();
  nextId = 1;
  creator: Group["access_info"] | null = null;
  creationTime = 0;
  private stored(id:string) {
    const value = this.groups.get(id);
    if (!value) throw new RealtimeGroupError(404,"realtime_group_not_found","Realtime conversation group not found");
    return value;
  }
  private title(input:unknown, except?:string) {
    if(typeof input !== "string") return invalid();
    const title = input.trim().replace(/\s+/gu," ");
    if(!title || title.length > 64) return invalid();
    if([...this.groups.values()].some(g=>g.id!==except && g.title.trim().replace(/\s+/gu," ").toLowerCase()===title.toLowerCase()))
      throw new RealtimeGroupError(409,"realtime_group_title_conflict","Group title already exists");
    return title;
  }
  private description(input:unknown) {
    if(input == null) return null;
    if(typeof input !== "string" || input.length > 500) return invalid();
    return input;
  }
  getGroup(id:string) { return structuredClone(this.stored(id)); }
  listGroups(query:{page_size?:number; search?:string|null; cursor?:string|null} = {}) {
    const size = query.page_size ?? 100;
    if(!Number.isSafeInteger(size)||size<1||size>100 || query.search != null && (typeof query.search!=="string"||query.search.length>64) || query.cursor!=null && !/^\d+$/.test(query.cursor)) return invalid();
    const offset = Number(query.cursor ?? "0"); if(!Number.isSafeInteger(offset)) return invalid();
    const search = query.search?.toLowerCase();
    const values = [...this.groups.values()].filter(g=>!search || `${g.title}\n${g.description??""}`.toLowerCase().includes(search))
      .sort((a,b)=>b.created_at_unix_secs-a.created_at_unix_secs||a.id.localeCompare(b.id));
    const has_more = offset+size<values.length;
    return {conversation_groups:structuredClone(values.slice(offset,offset+size)),has_more,next_cursor:has_more?String(offset+size):null};
  }
  createGroup(input:unknown) {
    if(!object(input)||Object.keys(input).some(k=>!["title","description"].includes(k))) return invalid();
    const title = this.title(input.title), description = this.description(input.description);
    if(!this.creator) throw new Error("Run a realtime group initialization scenario first");
    const n = this.nextId++;
    const group:Group = {id:`sim-realtime-group-created-${n}`,title,description,access_info:structuredClone(this.creator),sharing:{people_count:0,shared_with_everyone:false,everyone_role:null},created_at_unix_secs:this.creationTime+n};
    this.groups.set(group.id,group); return structuredClone(group);
  }
  updateGroup(id:string,input:unknown) {
    const group = this.stored(id);
    if(!object(input)||Object.keys(input).some(k=>!["title","description"].includes(k))) return invalid();
    const title = input.title == null ? group.title : this.title(input.title,id);
    const description = "description" in input ? this.description(input.description) : group.description;
    group.title=title; group.description=description; return structuredClone(group);
  }
  deleteGroup(id:string) {
    this.stored(id); this.groups.delete(id);
    for(const [conversation,group] of this.conversations) if(group===id) this.conversations.set(conversation,null);
    return {};
  }
  private conversation(id:string) {
    if(!this.conversations.has(id)) throw new RealtimeGroupError(404,"realtime_conversation_not_found","Realtime conversation not found");
  }
  setGroup(id:string,input:unknown) {
    this.conversation(id);
    if(!object(input)||typeof input.conversation_group_id!=="string"||Object.keys(input).some(k=>k!=="conversation_group_id")) return invalid();
    this.stored(input.conversation_group_id); this.conversations.set(id,input.conversation_group_id); return {};
  }
  clearGroup(id:string) { this.conversation(id); this.conversations.set(id,null); return {}; }
}
