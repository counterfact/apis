import type { WorkspaceAuditLogEntryResponse as AuditEntry } from "../../types/v1/components/schemas/WorkspaceAuditLogEntryResponse.js";
import type { ResourceMetadataResponseModel as ResourceMetadata } from "../../types/v1/components/schemas/ResourceMetadataResponseModel.js";
import type { WorkspaceMemberResponseModel as Member } from "../../types/v1/components/schemas/WorkspaceMemberResponseModel.js";
import type { WorkspaceGroupResponseModel as Group } from "../../types/v1/components/schemas/WorkspaceGroupResponseModel.js";
import type { SeatType } from "../../types/v1/components/schemas/SeatType.js";

type Profile = Omit<Member, "email" | "user_id">;
type Invitation = {
  seat_type: SeatType;
  group_ids: string[];
  usage_limit: number | null;
};
const object = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === "object" && !Array.isArray(v);
const seats: readonly string[] = [
  "workspace_admin",
  "workspace_member",
  "workspace_lite_member",
];
export class WorkspaceMemberError extends Error {
  override name = "WorkspaceMemberError";
  constructor(
    public status: number,
    public code: string,
    message: string,
  ) {
    super(message);
  }
}
const invalid = (): never => {
  throw new WorkspaceMemberError(
    400,
    "invalid_workspace_member_request",
    "Invalid workspace member request",
  );
};

export class Context {
  auditEntries: AuditEntry[] = [];
  resourceGrants = new Map<string, Map<string, string>>();
  resourceLookup: (
    type: string,
    id: string,
  ) => { name: string; creator: string } | undefined = () => undefined;
  serviceDirectory: () => Map<string, string> = () => new Map();
  keyDirectory: () => Map<string, { userId: string; name: string }> = () =>
    new Map();
  private resource(type: unknown, id: string) {
    if (!["voice", "voice_collection"].includes(String(type)))
      throw new WorkspaceMemberError(
        400,
        "unsupported_resource_type",
        "Only local voices and voice collections are supported",
      );
    return (
      this.resourceLookup(String(type), id) ??
      (() => {
        throw new WorkspaceMemberError(
          404,
          "resource_not_found",
          "Resource not found",
        );
      })()
    );
  }
  resourceMetadata(id: string, type: unknown): ResourceMetadata {
    const r = this.resource(type, id),
      grants =
        this.resourceGrants.get(`${type}/${id}`) ?? new Map<string, string>();
    const roles: Record<string, string[]> = { admin: [r.creator] };
    const available = [...this.memberDirectory()].map(([name, id]) => ({
      name,
      id,
      type: "user" as const,
    }));
    const options: ResourceMetadata["share_options"] = [
      ...available,
      ...[...this.groupDirectory().values()].map((g) => ({
        id: g.id,
        name: g.name,
        type: "group" as const,
      })),
      ...[...this.serviceDirectory()].map(([id, name]) => ({
        id,
        name,
        type: "key" as const,
      })),
    ];
    const live = new Set([...options.map((o) => o.id), "default"]);
    for (const [principal, role] of grants)
      if (principal !== r.creator && live.has(principal))
        (roles[role] ??= []).push(principal);
    for (const ids of Object.values(roles)) ids.sort();
    return structuredClone({
      resource_id: id,
      resource_name: r.name,
      resource_type: type as ResourceMetadata["resource_type"],
      creator_user_id: r.creator,
      anonymous_access_level_override: null,
      role_to_group_ids: roles,
      share_options: options
        .filter((o) => o.id !== r.creator && !grants.has(o.id))
        .sort((a, b) => a.id.localeCompare(b.id)),
    });
  }
  shareResource(id: string, input: unknown, remove = false) {
    if (
      !object(input) ||
      Object.keys(input).some(
        (k) =>
          ![
            "resource_type",
            "role",
            "user_email",
            "group_id",
            "workspace_api_key_id",
          ].includes(k),
      )
    )
      return invalid();
    const resource = this.resource(input.resource_type, id);
    if (
      !remove &&
      !["admin", "editor", "commenter", "viewer"].includes(String(input.role))
    )
      return invalid();
    const targets = ["user_email", "group_id", "workspace_api_key_id"].filter(
      (k) => input[k] != null,
    );
    if (
      targets.length !== 1 ||
      typeof input[targets[0]] !== "string" ||
      !input[targets[0]]
    )
      return invalid();
    const value = input[targets[0]] as string;
    const principal =
      targets[0] === "user_email"
        ? this.memberDirectory().get(value)
        : targets[0] === "group_id"
          ? value === "default" || this.groupDirectory().has(value)
            ? value
            : undefined
          : this.keyDirectory().get(value)?.userId;
    if (!principal)
      throw new WorkspaceMemberError(
        404,
        "sharing_principal_not_found",
        "Sharing principal not found",
      );
    if (principal === resource.creator && (remove || input.role !== "admin"))
      throw new WorkspaceMemberError(
        409,
        "resource_creator_protected",
        "Creator must retain admin access",
      );
    const key = `${input.resource_type}/${id}`,
      grants = this.resourceGrants.get(key) ?? new Map<string, string>();
    if (remove) grants.delete(principal);
    else if (principal !== resource.creator)
      grants.set(principal, input.role as string);
    this.resourceGrants.set(key, grants);
    return { status: "ok" };
  }
  listAudit(q: Record<string, unknown>) {
    const limit = q.limit ?? 50,
      cursor = q.cursor ?? "0";
    if (
      !Number.isInteger(limit) ||
      Number(limit) < 1 ||
      Number(limit) > 100 ||
      typeof cursor !== "string" ||
      !/^\d+$/.test(cursor) ||
      !Number.isSafeInteger(Number(cursor))
    )
      return invalid();
    const number = (v: unknown) =>
      v == null
        ? null
        : typeof v === "number" && Number.isSafeInteger(v) && v >= 0
          ? v
          : typeof v === "string" &&
              /^\d+$/.test(v) &&
              Number.isSafeInteger(Number(v))
            ? Number(v)
            : invalid();
    const from = number(q.time_from_unix_ms),
      to = number(q.time_to_unix_ms);
    if (from !== null && to !== null && from > to) return invalid();
    const rows = this.auditEntries
      .filter(
        (e) =>
          (from === null || (e.time ?? 0) >= from) &&
          (to === null || (e.time ?? 0) <= to) &&
          (q.actor_uid == null || e.actor.user.uid === q.actor_uid) &&
          (q.class_name == null || e.class_name === q.class_name) &&
          (q.activity_name == null || e.activity_name === q.activity_name),
      )
      .sort(
        (a, b) => (b.time ?? 0) - (a.time ?? 0) || a.id.localeCompare(b.id),
      );
    const offset = Number(cursor),
      entries = rows.slice(offset, offset + Number(limit)),
      has_more = offset + entries.length < rows.length;
    return {
      entries: structuredClone(entries),
      has_more,
      next_cursor: has_more ? String(offset + entries.length) : null,
    };
  }

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
