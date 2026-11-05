import { isDeepStrictEqual } from "node:util";
import type { AgentWorkflowResponseModel as Workflow } from "../../../../../../../types/v1/components/schemas/AgentWorkflowResponseModel.js";
import type { CompileProceduresValidationErrorResponseModel as CompilationErrors } from "../../../../../../../types/v1/components/schemas/CompileProceduresValidationErrorResponseModel.js";
import type { Context as Lifecycle } from "../../_.context.js";
import type { ProcedureAtVersionResponseModel as Procedure } from "../../../../../../../types/v1/components/schemas/ProcedureAtVersionResponseModel.js";
import type { ProcedureDraftResponseModel as Draft } from "../../../../../../../types/v1/components/schemas/ProcedureDraftResponseModel.js";
import type { ProcedureRefResponseModel as Ref } from "../../../../../../../types/v1/components/schemas/ProcedureRefResponseModel.js";
export type StoredVersion = {
  agentId: string;
  branchId: string;
  value: Procedure;
  handoffs: string[];
  referencesKnown: boolean;
};
export type Working = {
  value: Draft;
  handoffs: string[];
  referencesKnown: boolean;
};
export class ProcedureError extends Error {
  override name = "ProcedureError";
  constructor(
    public status: number,
    public code: string,
  ) {
    super(code);
  }
}
const fail = (status: number, code: string): never => {
  throw new ProcedureError(status, code);
};
const invalid = (): never => fail(400, "invalid_procedure_request");
const object = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);
export type CompilationFixture = {
  agentId: string;
  branchId: string;
  procedures: Draft[];
  workflow: Workflow;
};
export class Context {
  compilationFixtures: CompilationFixture[] = [];
  /** Exact synthetic input lookup only; this legacy dry-run never saves state. */
  compile(agentId: string, branchId: string):
    | { ok: true; workflow: Workflow }
    | ({ ok: false } & CompilationErrors) {
    const rows = this.all(agentId, branchId);
    const procedures = [...rows].sort(([a], [b]) => a.localeCompare(b)).map(([, row]) => {
      const { version_id: _, ...draft } = row.value as Procedure;
      return draft;
    });
    const fixture = this.compilationFixtures.find((f) =>
      f.agentId === agentId && f.branchId === branchId &&
      isDeepStrictEqual(f.procedures, procedures));
    if (fixture) return { ok: true, workflow: structuredClone(fixture.workflow) };
    return { ok: false, errors: Object.fromEntries(
      (procedures.length ? procedures.map((p) => p.procedure_id) : ["$procedures"])
        .map((id) => [id, [{ path: "content", message: "No synthetic compilation fixture matches the current procedure set." }]]),
    ) };
  }
  versions = new Map<string, StoredVersion>();
  working = new Map<string, Map<string, Working | null>>();
  nextProcedure = 0;
  lifecycle?: Lifecycle;
  private branch(agentId: string, branchId: string, mutate = false) {
    if (!this.lifecycle) throw new Error("Run startup or reset");
    const value = this.lifecycle.get(agentId, branchId);
    if (mutate && value.is_archived) fail(409, "branch_archived");
    return value;
  }
  private changes(branchId: string) {
    return this.working.get(branchId) ?? new Map<string, Working | null>();
  }
  private write(branchId: string, id: string, value: Working | null) {
    const changes = this.changes(branchId);
    changes.set(id, value);
    this.working.set(branchId, changes);
    const branch = this.lifecycle!.branches.get(branchId)!;
    branch.draftCreatedAt ??= branch.metadata.last_committed_at + 1;
  }
  private refs(
    agentId: string,
    branchId: string,
    agentVersion?: string | null,
  ): Record<string, Ref> {
    this.branch(agentId, branchId);
    if (agentVersion != null) {
      const metadata = this.lifecycle!.version(agentId, agentVersion);
      if (metadata.branch_id !== branchId)
        return fail(404, "version_not_found");
      return (
        this.lifecycle!.versions.get(agentVersion)!.configuration.procedures ??
        {}
      );
    }
    return (
      this.lifecycle!.select(agentId, { branch_id: branchId }).procedures ?? {}
    );
  }
  private published(
    agentId: string,
    branchId: string,
    id: string,
    agentVersion?: string | null,
  ) {
    const ref = this.refs(agentId, branchId, agentVersion)[id];
    const version = ref?.version_id
      ? this.versions.get(ref.version_id)
      : undefined;
    if (
      !version ||
      version.agentId !== agentId ||
      version.value.procedure_id !== id
    )
      return fail(404, "procedure_not_found");
    return version;
  }
  private all(agentId: string, branchId: string) {
    const rows = new Map<string, Working>();
    for (const id of Object.keys(this.refs(agentId, branchId))) {
      const version = this.published(agentId, branchId, id);
      rows.set(id, {
        value: version.value,
        handoffs: version.handoffs,
        referencesKnown: version.referencesKnown,
      });
    }
    for (const [id, value] of this.changes(branchId)) {
      if (value === null) rows.delete(id);
      else rows.set(id, value);
    }
    return rows;
  }
  private validate(input: unknown, patch: boolean) {
    if (input == null && !patch) input = {};
    if (
      !object(input) ||
      Object.keys(input).some(
        (k) =>
          ![
            "name",
            "content",
            "type",
            "trigger",
            "description",
            ...(patch ? [] : ["folder_parent_id"]),
          ].includes(k),
      )
    )
      return invalid();
    for (const key of ["name", "content", "type"])
      if (patch ? input[key] === undefined : false) return invalid();
    if (
      (input.name !== undefined && typeof input.name !== "string") ||
      (input.content !== undefined && typeof input.content !== "string") ||
      (input.type !== undefined &&
        (typeof input.type !== "string" ||
          !["free_form", "deterministic", "folder"].includes(input.type))) ||
      (input.trigger != null && typeof input.trigger !== "string") ||
      (input.description != null && typeof input.description !== "string") ||
      (input.trigger != null &&
        input.description != null &&
        input.trigger !== input.description) ||
      (input.folder_parent_id != null &&
        typeof input.folder_parent_id !== "string")
    )
      return invalid();
    return input;
  }
  create(agentId: string, branchId: string, input: unknown) {
    this.branch(agentId, branchId, true);
    const body = this.validate(input, false);
    const parent = body.folder_parent_id as string | null | undefined;
    if (parent != null) {
      const folder = this.all(agentId, branchId).get(parent);
      if (!folder) return fail(404, "procedure_not_found");
      if (folder.value.type !== "folder")
        return fail(400, "procedure_parent_not_folder");
    }
    let id: string;
    do {
      id = `sim-procedure-created-${++this.nextProcedure}`;
    } while (
      [...this.versions.values()].some((v) => v.value.procedure_id === id) ||
      [...this.working.values()].some((m) => m.has(id))
    );
    this.write(branchId, id, {
      value: {
        procedure_id: id,
        name: (body.name as string) ?? "",
        content: (body.content as string) ?? "",
        type: (body.type as Draft["type"]) ?? "free_form",
        trigger: (body.trigger as string) ?? (body.description as string) ?? "",
        folder_parent_id: parent ?? null,
      },
      handoffs: [],
      referencesKnown: !body.content,
    });
    return { procedure_id: id };
  }
  list(agentId: string, branchId: string, agentVersion?: string | null) {
    const refs = this.refs(agentId, branchId, agentVersion);
    const rows =
      agentVersion == null
        ? this.all(agentId, branchId)
        : new Map(
            Object.keys(refs).map((id) => {
              const v = this.published(agentId, branchId, id, agentVersion);
              return [
                id,
                {
                  value: v.value,
                  handoffs: v.handoffs,
                  referencesKnown: v.referencesKnown,
                },
              ];
            }),
          );
    return {
      procedures: [...rows]
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([id, stored]) => {
          const { content: _, ...metadata } = stored.value;
          return structuredClone({
            ...metadata,
            version_id: refs[id]?.version_id ?? null,
            has_draft: agentVersion == null && this.changes(branchId).has(id),
          });
        }),
    };
  }
  get(
    agentId: string,
    branchId: string,
    id: string,
    query: {
      version_id?: string | null;
      agent_version_id?: string | null;
    } = {},
  ): Procedure {
    this.branch(agentId, branchId);
    if (query.version_id != null) {
      const refs = this.refs(agentId, branchId, query.agent_version_id),
        version = this.versions.get(query.version_id);
      if (
        !refs[id] ||
        !version ||
        version.agentId !== agentId ||
        version.value.procedure_id !== id
      )
        return fail(404, "procedure_not_found");
      if (
        query.agent_version_id != null &&
        refs[id].version_id !== query.version_id
      )
        return fail(400, "procedure_version_mismatch");
      return structuredClone(version.value);
    }
    if (this.refs(agentId, branchId, query.agent_version_id)[id])
      return structuredClone(
        this.published(agentId, branchId, id, query.agent_version_id).value,
      );
    if (query.agent_version_id == null) {
      const value = this.changes(branchId).get(id);
      if (value) return structuredClone({ ...value.value, version_id: null });
    }
    return fail(404, "procedure_not_found");
  }
  draft(agentId: string, branchId: string, id: string): Draft {
    this.branch(agentId, branchId);
    const draft = this.changes(branchId).get(id);
    if (!draft) return fail(404, "procedure_draft_not_found");
    return structuredClone(draft.value);
  }
  updateDraft(agentId: string, branchId: string, id: string, input: unknown) {
    this.branch(agentId, branchId, true);
    const body = this.validate(input, true),
      current = this.all(agentId, branchId).get(id);
    if (!current) return fail(404, "procedure_not_found");
    const { version_id: _, ...value } = current.value as Procedure;
    const draft: Working = {
      value: {
        ...value,
        name: body.name as string,
        content: body.content as string,
        type: body.type as Draft["type"],
        trigger:
          (body.trigger as string) ??
          (body.description as string) ??
          value.trigger ??
          "",
      },
      handoffs:
        body.content === current.value.content ? [...current.handoffs] : [],
      referencesKnown:
        body.content === current.value.content
          ? current.referencesKnown
          : body.content === "",
    };
    this.write(branchId, id, draft);
    return structuredClone(draft.value);
  }
  deleteDraft(agentId: string, branchId: string, id: string) {
    this.branch(agentId, branchId, true);
    if (!this.changes(branchId).has(id) && !this.refs(agentId, branchId)[id])
      return fail(404, "procedure_not_found");
    this.changes(branchId).delete(id);
    return {};
  }
  clearBranchDrafts(agentId: string, branchId: string) {
    this.branch(agentId, branchId);
    this.working.delete(branchId);
  }
  remove(agentId: string, branchId: string, id: string) {
    this.branch(agentId, branchId, true);
    const rows = this.all(agentId, branchId);
    if (!rows.has(id)) return fail(404, "procedure_not_found");
    const removed = new Set([id]);
    let size: number;
    do {
      size = removed.size;
      for (const [key, item] of rows)
        if (
          item.value.folder_parent_id != null &&
          removed.has(item.value.folder_parent_id)
        )
          removed.add(key);
    } while (removed.size !== size);
    if (
      [...rows].some(
        ([key, item]) => !removed.has(key) && !item.referencesKnown,
      )
    )
      return fail(409, "procedure_reference_analysis_required");
    if (
      [...rows].some(
        ([key, item]) =>
          !removed.has(key) &&
          item.handoffs.some((target) => removed.has(target)),
      )
    )
      return fail(409, "procedure_referenced");
    for (const key of removed) this.write(branchId, key, null);
    return {};
  }
}
