import type { WorkspaceMemberResponseModel as Member } from "../../types/v1/components/schemas/WorkspaceMemberResponseModel.js";
import type { WorkspaceGroupResponseModel as Group } from "../../types/v1/components/schemas/WorkspaceGroupResponseModel.js";
import type { SeatType } from "../../types/v1/components/schemas/SeatType.js";

type Profile = Omit<Member, "email" | "user_id">;
type Invitation = { seat_type: SeatType; group_ids: string[]; usage_limit: number | null };
const object = (v: unknown): v is Record<string, unknown> => !!v && typeof v === "object" && !Array.isArray(v);
const seats: readonly string[] = ["workspace_admin", "workspace_member", "workspace_lite_member"];
export class WorkspaceMemberError extends Error {
  override name = "WorkspaceMemberError";
  constructor(public status: number, public code: string, message: string) { super(message); }
}
const invalid = (): never => { throw new WorkspaceMemberError(400, "invalid_workspace_member_request", "Invalid workspace member request"); };

export class Context {
  profiles = new Map<string, Profile>();
  invitations = new Map<string, Invitation>();
  verifiedDomains = new Set<string>();
  memberDirectory: () => Map<string, string> = () => new Map();
  groupDirectory: () => Map<string, Group> = () => new Map();

  listMembers(): Member[] {
    return [...this.memberDirectory()].sort(([a],[b]) => a.localeCompare(b)).flatMap(([email,user_id]) => {
      const profile = this.profiles.get(user_id);
      return profile ? [{email,user_id,...structuredClone(profile)}] : [];
    });
  }

  private email(value: unknown) {
    if (typeof value !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return invalid();
    return value;
  }

  updateMember(input: unknown) {
    if (!object(input) || Object.keys(input).some(k => !["email","is_locked","workspace_role","workspace_seat_type","allow_downgrade_to_basic_seat"].includes(k))) return invalid();
    const email = this.email(input.email);
    const id = this.memberDirectory().get(email), member = id ? this.profiles.get(id) : undefined;
    if (!member) throw new WorkspaceMemberError(404,"workspace_member_not_found","Workspace member not found");
    for (const key of ["workspace_role","workspace_seat_type"]) if (input[key] != null && (typeof input[key] !== "string" || !seats.includes(input[key]))) return invalid();
    if (input.is_locked != null && typeof input.is_locked !== "boolean" || input.allow_downgrade_to_basic_seat !== undefined && typeof input.allow_downgrade_to_basic_seat !== "boolean") return invalid();
    const seat = input.workspace_seat_type ?? input.workspace_role;
    if (seat != null) member.seat_type = seat as SeatType;
    if (input.is_locked != null) member.is_locked = input.is_locked as boolean;
    return {status:"ok"};
  }

  private invitation(input: Record<string, unknown>, bulk: boolean): Invitation {
    const keys = bulk ? ["emails","seat_type","group_ids","usage_limit"] : ["email","workspace_permission","seat_type","group_ids","usage_limit"];
    if (Object.keys(input).some(k => !keys.includes(k))) return invalid();
    for (const key of ["seat_type", ...(bulk ? [] : ["workspace_permission"])]) if (input[key] != null && (typeof input[key] !== "string" || !seats.includes(input[key]))) return invalid();
    if (input.group_ids != null && (!Array.isArray(input.group_ids) || input.group_ids.some(id => typeof id !== "string"))) return invalid();
    if (input.usage_limit != null && (!Number.isSafeInteger(input.usage_limit) || (input.usage_limit as number) < 0)) return invalid();
    const group_ids = [...new Set((input.group_ids ?? []) as string[])];
    for (const id of group_ids) if (!this.groupDirectory().has(id)) throw new WorkspaceMemberError(404,"group_not_found","Workspace group not found");
    return {seat_type:(input.seat_type ?? input.workspace_permission ?? "workspace_member") as SeatType,group_ids,usage_limit:(input.usage_limit ?? null) as number | null};
  }

  private inviteEmails(emails: string[], definition: Invitation, bulk: boolean) {
    for (const email of emails) {
      if (this.memberDirectory().has(email)) throw new WorkspaceMemberError(400,"workspace_member_exists","User is already a workspace member");
      if (bulk && !this.verifiedDomains.has(email.slice(email.lastIndexOf("@")+1).toLowerCase())) throw new WorkspaceMemberError(400,"unverified_email_domain","Bulk invitations require a scenario-verified domain");
    }
    for (const email of new Set(emails)) this.invitations.set(email,structuredClone(definition));
    return {status:"ok"};
  }

  invite(input: unknown) {
    if (!object(input)) return invalid();
    const email = this.email(input.email), definition = this.invitation(input,false);
    return this.inviteEmails([email],definition,false);
  }

  inviteBulk(input: unknown) {
    if (!object(input) || !Array.isArray(input.emails) || !input.emails.length) return invalid();
    const emails = input.emails.map(value => this.email(value)), definition = this.invitation(input,true);
    return this.inviteEmails(emails,definition,true);
  }

  deleteInvite(input: unknown) {
    if (!object(input) || Object.keys(input).length !== 1) return invalid();
    const email = this.email(input.email);
    if (!this.invitations.delete(email)) throw new WorkspaceMemberError(404,"workspace_invite_not_found","Workspace invitation not found");
    return {status:"ok"};
  }
}
