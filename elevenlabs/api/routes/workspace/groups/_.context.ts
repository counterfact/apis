import type { WorkspaceGroupResponseModel } from "../../../types/v1/components/schemas/WorkspaceGroupResponseModel.js";

export class GroupError extends Error {
  override name = "GroupError";
  constructor(public status: number, public code: string, message: string) { super(message); }
}

export class Context {
  groups = new Map<string, WorkspaceGroupResponseModel>();
  /** Scenario-owned synthetic workspace directory: email -> member ID. */
  members = new Map<string, string>();

  listGroups() { return structuredClone(Object.fromEntries(this.groups)); }

  searchGroups(name: string) {
    const needle = name.trim().toLowerCase();
    if (!needle) return [];
    const emails = new Map([...this.members].map(([email, id]) => [id, email]));
    return [...this.groups.values()].filter((group) => group.name.toLowerCase().includes(needle))
      .map((group) => ({ id: group.id, name: group.name,
        members_emails: group.members.flatMap((id) => emails.has(id) ? [emails.get(id)!] : []) }));
  }

  private changeMember(groupId: string, input: unknown, remove: boolean) {
    if (!input || typeof input !== "object" || Array.isArray(input) ||
      Object.keys(input).length !== 1 || !("email" in input) || typeof input.email !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) {
      throw new GroupError(400, "invalid_member_email", "Provide a valid workspace member email only");
    }
    const group = this.groups.get(groupId);
    if (!group) throw new GroupError(404, "group_not_found", "Workspace group not found");
    if (group.scim_frozen) throw new GroupError(409, "group_scim_frozen", "SCIM-frozen group membership cannot change");
    const memberId = this.members.get(input.email);
    if (!memberId) throw new GroupError(404, "workspace_member_not_found", "Synthetic workspace member not found");
    if (remove) group.members = group.members.filter((id) => id !== memberId);
    else if (!group.members.includes(memberId)) group.members.push(memberId);
    return { status: "ok" };
  }

  addMember(groupId: string, input: unknown) { return this.changeMember(groupId, input, false); }
  removeMember(groupId: string, input: unknown) { return this.changeMember(groupId, input, true); }
}
