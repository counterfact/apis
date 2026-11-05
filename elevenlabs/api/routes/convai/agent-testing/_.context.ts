import type { GetResponseUnitTestResponseModel as Llm } from "../../../types/v1/components/schemas/GetResponseUnitTestResponseModel.js";
import type { GetToolCallUnitTestResponseModel as Tool } from "../../../types/v1/components/schemas/GetToolCallUnitTestResponseModel.js";
import type { GetSimulationTestResponseModel as Simulation } from "../../../types/v1/components/schemas/GetSimulationTestResponseModel.js";
import type { UnitTestSummaryResponseModel as Summary } from "../../../types/v1/components/schemas/UnitTestSummaryResponseModel.js";
import type { ResourceAccessInfo as Access } from "../../../types/v1/components/schemas/ResourceAccessInfo.js";
type Obj = Record<string, unknown>;
type Meta = {
  parent: string | null;
  creator: string;
  created: number;
  updated: number;
  access: Access;
};
export type StoredTest = Meta & {
  definition:
    | (Llm & { type: "llm" })
    | (Tool & { type: "tool" })
    | (Simulation & { type: "simulation" });
};
export type StoredFolder = Meta & { id: string; name: string };
const object = (v: unknown): v is Obj =>
  !!v && typeof v === "object" && !Array.isArray(v);
const text = (v: unknown): v is string => typeof v === "string" && !!v.trim();
export class AgentTestError extends Error {
  override name = "AgentTestError";
  constructor(
    public status: number,
    public code: string,
    message: string,
  ) {
    super(message);
  }
}
const invalid = (): never => {
  throw new AgentTestError(
    400,
    "invalid_agent_test_request",
    "Invalid local agent test request",
  );
};
function input(v: unknown, allowed: string[]) {
  if (!object(v) || Object.keys(v).some((k) => !allowed.includes(k)))
    return invalid();
  return v;
}
export class Context {
  tests = new Map<string, StoredTest>();
  folders = new Map<string, StoredFolder>();
  nextId = 1;
  nextMutation = 0;
  defaults?: { time: number; userId: string; access: Access };
  private settings() {
    if (!this.defaults)
      throw new Error("Run agent test startup or reset first");
    return this.defaults;
  }
  private now() {
    return this.settings().time + ++this.nextMutation;
  }
  private storedFolder(id: string) {
    const f = this.folders.get(id);
    if (!f)
      throw new AgentTestError(
        404,
        "agent_test_folder_not_found",
        "Agent test folder not found",
      );
    return f;
  }
  private entity(id: string): Meta {
    const e = this.tests.get(id) ?? this.folders.get(id);
    if (!e)
      throw new AgentTestError(
        404,
        "agent_test_entity_not_found",
        "Agent test or folder not found",
      );
    return e;
  }
  private path(id: string | null): { id: string; name: string }[] {
    const rows: { id: string; name: string }[] = [];
    const seen = new Set<string>();
    while (id !== null) {
      if (seen.has(id)) throw new Error("Invalid cyclic agent test state");
      seen.add(id);
      const f = this.storedFolder(id);
      rows.unshift({ id: f.id, name: f.name });
      id = f.parent;
    }
    return rows;
  }
  get(id: string) {
    const t = this.tests.get(id);
    if (!t)
      throw new AgentTestError(
        404,
        "agent_test_not_found",
        "Agent test not found",
      );
    return structuredClone({ ...t.definition, access_info: t.access });
  }
  delete(id: string) {
    this.get(id);
    this.tests.delete(id);
  }
  folder(id: string) {
    const f = this.storedFolder(id);
    return {
      id: f.id,
      name: f.name,
      folder_path: this.path(id),
      children_count: this.children(id).length,
    };
  }
  private children(id: string) {
    return [...this.tests.entries(), ...this.folders.entries()]
      .filter(([, v]) => v.parent === id)
      .map(([key]) => key);
  }
  createFolder(value: unknown) {
    const b = input(value, ["name", "parent_folder_id"]);
    if (
      !text(b.name) ||
      (b.parent_folder_id != null && !text(b.parent_folder_id))
    )
      return invalid();
    const parent = (b.parent_folder_id as string) ?? null;
    if (parent !== null) this.storedFolder(parent);
    const defaults = this.settings();
    let id: string;
    do {
      id = `sim-test-folder-created-${this.nextId++}`;
    } while (this.tests.has(id) || this.folders.has(id));
    const time = this.now();
    this.folders.set(id, {
      id,
      name: b.name,
      parent,
      creator: defaults.userId,
      created: time,
      updated: time,
      access: structuredClone(defaults.access),
    });
    return { id, name: b.name };
  }
  renameFolder(id: string, value: unknown) {
    const f = this.storedFolder(id),
      b = input(value, ["name"]);
    if (!text(b.name)) return invalid();
    if (f.name !== b.name) {
      f.name = b.name;
      f.updated = this.now();
    }
    return this.folder(id);
  }
  move(value: unknown) {
    const b = input(value, ["entity_ids", "move_to"]);
    if (
      !Array.isArray(b.entity_ids) ||
      !b.entity_ids.length ||
      b.entity_ids.some((id) => !text(id)) ||
      new Set(b.entity_ids).size !== b.entity_ids.length ||
      (b.move_to != null && !text(b.move_to))
    )
      return invalid();
    const parent = (b.move_to as string) ?? null;
    if (parent !== null) this.storedFolder(parent);
    const ids = b.entity_ids as string[],
      entities = ids.map((id) => this.entity(id));
    const ancestors = new Set(this.path(parent).map((p) => p.id));
    if (ids.some((id) => this.folders.has(id) && ancestors.has(id)))
      return invalid();
    const changed = entities.filter((e) => e.parent !== parent);
    if (changed.length) {
      const time = this.now();
      for (const e of changed) {
        e.parent = parent;
        e.updated = time;
      }
    }
  }
  deleteFolder(id: string, force = false) {
    this.storedFolder(id);
    if (typeof force !== "boolean") return invalid();
    const descendants = new Set([id]);
    for (const current of descendants)
      for (const child of this.children(current)) descendants.add(child);
    if (descendants.size > 1 && !force)
      throw new AgentTestError(
        409,
        "agent_test_folder_not_empty",
        "Use force to delete a nonempty folder",
      );
    for (const key of descendants) {
      this.tests.delete(key);
      this.folders.delete(key);
    }
  }
  private summary(id: string): Summary {
    const t = this.tests.get(id),
      f = this.folders.get(id),
      e = t ?? f;
    if (!e)
      throw new AgentTestError(
        404,
        "agent_test_entity_not_found",
        "Agent test or folder not found",
      );
    return structuredClone({
      id,
      name: t ? t.definition.name : f!.name,
      type: t ? (t.definition.type ?? "llm") : "folder",
      entity_type: t ? "test" : "folder",
      created_at_unix_secs: e.created,
      last_updated_at_unix_secs: e.updated,
      access_info: e.access,
      folder_parent_id: e.parent,
      folder_path: this.path(e.parent),
      children_count: t ? null : this.children(id).length,
      conversation_initiation_source:
        t?.definition.conversation_initiation_source ?? null,
    });
  }
  summaries(value: unknown) {
    const b = input(value, ["test_ids"]);
    if (
      !Array.isArray(b.test_ids) ||
      b.test_ids.some((id) => !text(id)) ||
      new Set(b.test_ids).size !== b.test_ids.length
    )
      return invalid();
    return {
      tests: Object.fromEntries(
        (b.test_ids as string[])
          .filter((id) => this.tests.has(id))
          .map((id) => [id, this.summary(id)]),
      ),
    };
  }
  list(value: Record<string, unknown> = {}) {
    const q = input(value, [
        "cursor",
        "page_size",
        "search",
        "parent_folder_id",
        "types",
        "include_folders",
        "sort_mode",
        "sharing_mode",
        "created_by_user_id",
      ]),
      size = q.page_size ?? 30,
      cursor = q.cursor ?? "0";
    if (
      typeof size !== "number" ||
      !Number.isSafeInteger(size) ||
      size < 1 ||
      size > 100 ||
      typeof cursor !== "string" ||
      !/^(0|[1-9][0-9]*)$/.test(cursor) ||
      !Number.isSafeInteger(Number(cursor)) ||
      (q.search != null && typeof q.search !== "string") ||
      (q.parent_folder_id != null && !text(q.parent_folder_id)) ||
      (q.include_folders != null && typeof q.include_folders !== "boolean") ||
      (q.sort_mode != null &&
        !["default", "folders_first"].includes(q.sort_mode as string)) ||
      (q.sharing_mode != null &&
        !["all", "shared_with_me"].includes(q.sharing_mode as string)) ||
      (q.created_by_user_id != null && !text(q.created_by_user_id))
    )
      return invalid();
    const types = q.types;
    if (
      types != null &&
      (!Array.isArray(types) ||
        types.some(
          (t) => !["llm", "tool", "simulation", "folder"].includes(t as string),
        ))
    )
      return invalid();
    const parent = q.parent_folder_id === "root" ? null : q.parent_folder_id;
    if (parent != null) this.storedFolder(parent as string);
    const creator =
      q.created_by_user_id === "@me"
        ? this.settings().userId
        : q.created_by_user_id;
    const rows = [...this.tests.keys(), ...this.folders.keys()]
      .filter((id) => {
        const e = this.entity(id),
          s = this.summary(id);
        return (
          (q.parent_folder_id == null || e.parent === parent) &&
          (q.search == null ||
            s.name
              .toLowerCase()
              .includes((q.search as string).toLowerCase())) &&
          (types != null
            ? (types as string[]).includes(s.type)
            : q.include_folders !== false || s.type !== "folder") &&
          (creator == null || e.creator === creator) &&
          (q.sharing_mode !== "shared_with_me" ||
            e.creator !== this.settings().userId)
        );
      })
      .map((id) => this.summary(id))
      .sort(
        (a, b) =>
          (q.sort_mode === "folders_first"
            ? Number(b.entity_type === "folder") -
              Number(a.entity_type === "folder")
            : 0) ||
          b.created_at_unix_secs - a.created_at_unix_secs ||
          a.id.localeCompare(b.id),
      );
    const offset = Number(cursor),
      has_more = offset + size < rows.length;
    return {
      tests: rows.slice(offset, offset + size),
      has_more,
      next_cursor: has_more ? String(offset + size) : null,
    };
  }
}
