import type { StoredAgent } from "../../_.context.js";
import type { GetAgentResponseModel as Agent } from "../../../../../types/v1/components/schemas/GetAgentResponseModel.js";
import type { AgentBranchResponse as Branch } from "../../../../../types/v1/components/schemas/AgentBranchResponse.js";
import type { AgentVersionMetadata as Version } from "../../../../../types/v1/components/schemas/AgentVersionMetadata.js";
import type { AgentDeploymentHistoryItem as Deployment } from "../../../../../types/v1/components/schemas/AgentDeploymentHistoryItem.js";
import type { FieldConflict } from "../../../../../types/v1/components/schemas/FieldConflict.js";
import { isDeepStrictEqual as equal } from "node:util";
export type StoredBranch = {
  metadata: Branch;
  tip: string;
  draftCreatedAt: number | null;
  parentBranchId: string | null;
};
export type StoredVersion = { metadata: Version; configuration: Agent };
export class LifecycleError extends Error {
  override name = "LifecycleError";
  constructor(
    public status: number,
    public code: string,
  ) {
    super(code);
  }
}
const fail = (status: number, code: string): never => {
  throw new LifecycleError(status, code);
};
const invalid = (): never => fail(400, "invalid_agent_lifecycle_request");
const object = (x: unknown): x is Record<string, unknown> =>
  typeof x === "object" && x !== null && !Array.isArray(x);
export class Context {
  branches = new Map<string, StoredBranch>();
  versions = new Map<string, StoredVersion>();
  history = new Map<string, Deployment[]>();
  nextDeployment = 0;
  nextVersion = 0;
  agents?: () => Map<string, StoredAgent>;
  private agent(id: string) {
    return this.agents?.().get(id) ?? fail(404, "agent_not_found");
  }
  private branch(id: string, branchId: string) {
    this.agent(id);
    const b = this.branches.get(branchId);
    return b?.metadata.agent_id === id ? b : fail(404, "branch_not_found");
  }
  private branchName(b: StoredBranch) {
    const main = this.agent(b.metadata.agent_id).mainBranch;
    return main?.id === b.metadata.id ? main.name : b.metadata.name;
  }
  private project(b: StoredBranch) {
    const active = (this.history.get(b.metadata.agent_id) ?? []).find(
      (h) => h.is_active,
    );
    const parent =
      b.parentBranchId === null
        ? undefined
        : this.branches.get(b.parentBranchId);
    return {
      ...structuredClone(b.metadata),
      name: this.branchName(b),
      current_live_percentage:
        active?.traffic_percentage_branch_id_map?.[b.metadata.id] ?? 0,
      most_recent_versions: [...this.versions.values()]
        .filter((v) => v.metadata.branch_id === b.metadata.id)
        .sort(
          (x, y) =>
            y.metadata.seq_no_in_branch - x.metadata.seq_no_in_branch ||
            x.metadata.id.localeCompare(y.metadata.id),
        )
        .map((v) => structuredClone(v.metadata)),
      parent_branch: parent
        ? { id: parent.metadata.id, name: this.branchName(parent) }
        : null,
    };
  }
  get(id: string, branchId: string) {
    return this.project(this.branch(id, branchId));
  }
  list(id: string, q: Record<string, unknown> = {}) {
    this.agent(id);
    const limit = q.limit ?? 100;
    if (
      !Number.isInteger(limit) ||
      Number(limit) <= 1 ||
      Number(limit) > 100 ||
      (q.include_archived != null && typeof q.include_archived !== "boolean") ||
      (q.include_commit_status != null &&
        typeof q.include_commit_status !== "boolean")
    )
      return invalid();
    if (q.include_commit_status === true)
      return fail(400, "unsupported_commit_comparison");
    return {
      results: [...this.branches.values()]
        .filter(
          (b) =>
            b.metadata.agent_id === id &&
            (q.include_archived || !b.metadata.is_archived),
        )
        .sort(
          (a, b) =>
            a.metadata.created_at - b.metadata.created_at ||
            a.metadata.id.localeCompare(b.metadata.id),
        )
        .slice(0, Number(limit))
        .map((b) => {
          const { most_recent_versions, parent_branch, ...metadata } =
            this.project(b);
          return {
            ...metadata,
            parent_branch_id: parent_branch?.id ?? null,
            draft_exists: b.draftCreatedAt !== null,
            draft_created_at: b.draftCreatedAt,
            draft_is_behind_tip:
              b.draftCreatedAt !== null &&
              b.draftCreatedAt < b.metadata.last_committed_at,
            commits_ahead: null,
            commits_behind: null,
          };
        }),
    };
  }
  version(id: string, versionId: string) {
    this.agent(id);
    const v = this.versions.get(versionId);
    if (v?.metadata.agent_id !== id) return fail(404, "version_not_found");
    return structuredClone(v.metadata);
  }
  select(
    id: string,
    q: { branch_id?: string | null; version_id?: string | null },
  ) {
    const record = this.agent(id),
      a = record.configuration,
      mainId = record.mainBranch?.id;
    if (q.branch_id != null && q.version_id != null) return invalid();
    if (q.branch_id == null && q.version_id == null) return structuredClone(a);
    const v =
      q.version_id != null
        ? (this.version(id, q.version_id), this.versions.get(q.version_id)!)
        : this.versions.get(this.branch(id, q.branch_id!).tip);
    if (!v) return fail(404, "version_not_found");
    // Main branch reads follow the canonical mutable configuration. Version reads
    // preserve their immutable historical snapshot, including historical references.
    const value =
      q.version_id == null && q.branch_id === mainId ? a : v.configuration;
    return structuredClone({
      ...value,
      agent_id: id,
      branch_id: v.metadata.branch_id,
      version_id: v.metadata.id,
      main_branch_id: mainId,
    });
  }
  update(id: string, branchId: string, input: unknown = {}) {
    const b = this.branch(id, branchId),
      a = this.agent(id);
    if (
      !object(input) ||
      Object.keys(input).some(
        (k) =>
          ![
            "name",
            "description",
            "is_archived",
            "protection_status",
            "auto_rebase",
          ].includes(k),
      ) ||
      (input.name != null &&
        (typeof input.name !== "string" ||
          !input.name.trim() ||
          input.name.length > 140)) ||
      (input.description != null &&
        (typeof input.description !== "string" ||
          input.description.length > 4096)) ||
      (input.is_archived != null && typeof input.is_archived !== "boolean") ||
      (input.auto_rebase != null && typeof input.auto_rebase !== "boolean") ||
      (input.protection_status != null &&
        !["writer_perms_required", "admin_perms_required"].includes(
          String(input.protection_status),
        ))
    )
      return invalid();
    if (input.auto_rebase === true) return fail(400, "unsupported_auto_rebase");
    if (
      input.name != null &&
      [...this.branches.values()].some(
        (x) =>
          x !== b &&
          x.metadata.agent_id === id &&
          this.branchName(x) === input.name,
      )
    )
      return fail(409, "branch_name_conflict");
    if (
      input.is_archived === true &&
      (branchId === a.mainBranch?.id ||
        this.project(b).current_live_percentage > 0)
    )
      return fail(409, "branch_in_use");
    const next = structuredClone(b.metadata);
    for (const key of [
      "name",
      "description",
      "is_archived",
      "protection_status",
      "auto_rebase",
    ] as const)
      if (input[key] != null) Object.assign(next, { [key]: input[key] });
    b.metadata = next;
    if (a.mainBranch?.id === branchId && input.name != null)
      a.mainBranch.name = input.name as string;
    return this.project(b);
  }
  deployments(id: string, q: Record<string, unknown> = {}) {
    this.agent(id);
    const page = q.page ?? 1,
      size = q.page_size ?? 30;
    if (
      !Number.isInteger(page) ||
      Number(page) < 1 ||
      !Number.isSafeInteger(page) ||
      !Number.isInteger(size) ||
      Number(size) < 1 ||
      Number(size) > 100
    )
      return invalid();
    const rows = [...(this.history.get(id) ?? [])].sort(
      (a, b) =>
        b.deployed_at_unix_secs - a.deployed_at_unix_secs ||
        b.id.localeCompare(a.id),
    );
    return {
      meta: { total: rows.length, page: Number(page), page_size: Number(size) },
      results: structuredClone(
        rows.slice(
          (Number(page) - 1) * Number(size),
          Number(page) * Number(size),
        ),
      ),
    };
  }
  deploy(id: string, input: unknown) {
    const a = this.agent(id).configuration;
    if (
      !object(input) ||
      Object.keys(input).some((k) => k !== "deployment_request") ||
      !object(input.deployment_request) ||
      Object.keys(input.deployment_request).some((k) => k !== "requests") ||
      !Array.isArray(input.deployment_request.requests) ||
      input.deployment_request.requests.length === 0
    )
      return invalid();
    const splits: Record<string, number> = Object.create(null);
    for (const request of input.deployment_request.requests) {
      if (
        !object(request) ||
        Object.keys(request).some(
          (k) => !["branch_id", "deployment_strategy"].includes(k),
        ) ||
        typeof request.branch_id !== "string" ||
        !object(request.deployment_strategy) ||
        Object.keys(request.deployment_strategy).some(
          (k) => !["type", "traffic_percentage"].includes(k),
        ) ||
        (request.deployment_strategy.type != null &&
          request.deployment_strategy.type !== "percentage")
      )
        return invalid();
      const b = this.branch(id, request.branch_id),
        percentage = request.deployment_strategy.traffic_percentage;
      if (b.metadata.is_archived) return fail(409, "branch_archived");
      if (
        Object.hasOwn(splits, request.branch_id) ||
        typeof percentage !== "number" ||
        !Number.isFinite(percentage) ||
        percentage < 0 ||
        percentage > 100
      )
        return invalid();
      splits[request.branch_id] = percentage;
    }
    if (
      Math.abs(Object.values(splits).reduce((sum, x) => sum + x, 0) - 100) >
      1e-9
    )
      return invalid();
    let deploymentId: string;
    do {
      deploymentId = `sim-deployment-created-${++this.nextDeployment}`;
    } while (
      [...this.history.values()].flat().some((h) => h.id === deploymentId)
    );
    const rows = this.history.get(id) ?? [];
    const time =
      Math.max(
        a.metadata.updated_at_unix_secs,
        ...rows.map((h) => h.deployed_at_unix_secs),
      ) + 1;
    this.history.set(id, [
      ...rows.map((h) => ({ ...h, is_active: false })),
      {
        id: deploymentId,
        traffic_percentage_branch_id_map: structuredClone(splits),
        deployed_at_unix_secs: time,
        is_active: true,
        source: "manual",
        access_info: structuredClone(a.access_info),
      },
    ]);
    return { traffic_percentage_branch_id_map: structuredClone(splits) };
  }
  clearProcedureDrafts?: (agentId: string, branchId: string) => void;
  private ancestors(id: string, tip: string) {
    const distances = new Map<string, number>();
    const pending: [string, number][] = [[tip, 0]];
    for (let index = 0; index < pending.length; index++) {
      const [key, distance] = pending[index]!;
      if (distances.has(key)) continue;
      const version = this.versions.get(key);
      if (version?.metadata.agent_id !== id) fail(409, "incomplete_branch_ancestry");
      distances.set(key, distance);
      const parents = version!.metadata.parents;
      for (const parent of [parents.in_branch_parent_id, parents.out_of_branch_parent_id, parents.merged_from_version_id, parents.rebased_from_version_id])
        if (parent) pending.push([parent, distance + 1]);
    }
    return distances;
  }
  private plan(id: string, sourceId: string, targetId: string, force: boolean, rebase: boolean) {
    const source = this.branch(id, sourceId), target = this.branch(id, targetId);
    if (sourceId === targetId) return invalid();
    if (source.metadata.is_archived || target.metadata.is_archived) fail(409, "branch_archived");
    const sourceAncestors = this.ancestors(id, source.tip), targetAncestors = this.ancestors(id, target.tip);
    const baseId = [...sourceAncestors.keys()].filter(key => targetAncestors.has(key)).sort((a, b) =>
      sourceAncestors.get(a)! + targetAncestors.get(a)! - sourceAncestors.get(b)! - targetAncestors.get(b)! || a.localeCompare(b))[0];
    if (!baseId) return fail(409, "no_common_ancestor");
    const base = this.versions.get(baseId)!.configuration;
    const from = this.select(id, { branch_id: sourceId }), to = this.select(id, { branch_id: targetId });
    const sourceTime = Math.max(source.metadata.last_committed_at, from.metadata.updated_at_unix_secs);
    const targetTime = Math.max(target.metadata.last_committed_at, to.metadata.updated_at_unix_secs);
    const sourceWins = !rebase && (force || sourceTime > targetTime);
    const conflicts: FieldConflict[] = [];
    const mergeValue = (ancestor: unknown, left: unknown, right: unknown, section: FieldConflict["section"], path: string): unknown => {
      if (equal(left, ancestor)) return structuredClone(right);
      if (equal(right, ancestor) || equal(left, right)) return structuredClone(left);
      // Procedure references identify immutable versions and are merged as units.
      // Arrays and discriminated values also replace atomically.
      if (object(left) && object(right) && (ancestor === undefined || object(ancestor)) &&
          !(section === "procedures" && path) && left.type === right.type) {
        const value: Record<string, unknown> = {};
        for (const key of [...new Set([...Object.keys(object(ancestor) ? ancestor : {}), ...Object.keys(left), ...Object.keys(right)])].sort()) {
          const child = mergeValue(object(ancestor) ? ancestor[key] : undefined, left[key], right[key], section, path ? `${path}.${key}` : key);
          if (child !== undefined) Object.defineProperty(value, key, { value: child, enumerable: true, configurable: true, writable: true });
        }
        return value;
      }
      conflicts.push({ section, path, ...(ancestor === undefined ? {} : { base_value: structuredClone(ancestor) }), ...(left === undefined ? {} : { source_value: structuredClone(left) }), ...(right === undefined ? {} : { target_value: structuredClone(right) }) });
      return structuredClone(sourceWins ? left : right);
    };
    const merged = structuredClone(to);
    for (const section of ["conversation_config", "platform_settings", "workflow", "procedures"] as const) {
      const value = mergeValue(base[section], from[section], to[section], section, "");
      if (value === undefined) delete merged[section];
      else Object.assign(merged, { [section]: value });
    }
    const unchanged = ["conversation_config", "platform_settings", "workflow", "procedures"].every(section => equal(merged[section as keyof Agent], to[section as keyof Agent]));
    return { source, target, merged, conflicts, unchanged };
  }
  private previewOptions(input: unknown, forceAllowed: boolean) {
    if (!object(input) || Object.keys(input).some(key => !["include_procedure_generated_workflow_elements", ...(forceAllowed ? ["force"] : [])].includes(key)) ||
      Object.values(input).some(value => typeof value !== "boolean")) return invalid();
    if (input.include_procedure_generated_workflow_elements === true) fail(400, "unsupported_generated_workflow");
    return input;
  }
  mergePreview(id: string, sourceId: string, targetId: string, options: unknown = {}) {
    const input = this.previewOptions(options, true);
    const plan = this.plan(id, sourceId, targetId, input.force === true, false);
    return { ...plan.merged, overridden_fields: plan.conflicts.map(c => `${c.section}.${c.path}`), conflicts: plan.conflicts, source_identical_to_target: plan.unchanged };
  }
  rebasePreview(id: string, targetId: string, sourceId?: string | null, options: unknown = {}) {
    this.previewOptions(options, false);
    const from = sourceId ?? this.agent(id).mainBranch?.id;
    if (!from) return fail(404, "branch_not_found");
    const plan = this.plan(id, from, targetId, false, true);
    return { ...plan.merged, overridden_fields: plan.conflicts.map(c => `${c.section}.${c.path}`), conflicts: plan.conflicts, source_identical_to_target: plan.unchanged };
  }
  private commitPlan(id: string, plan: ReturnType<Context["plan"]>, rebase: boolean, archive: boolean) {
    if (rebase && plan.unchanged) fail(409, "branch_already_up_to_date");
    if (archive && (plan.source.metadata.id === this.agent(id).mainBranch?.id || this.project(plan.source).current_live_percentage > 0)) fail(409, "branch_in_use");
    // Validate every precondition before allocating an ID or changing any state.
    const branchId = plan.target.metadata.id;
    let number = this.nextVersion, versionId: string;
    do { versionId = `sim-agent-version-created-${++number}`; } while (this.versions.has(versionId));
    const time = Math.max(plan.source.metadata.last_committed_at, plan.target.metadata.last_committed_at, plan.merged.metadata.updated_at_unix_secs,
      ...[...this.versions.values()].filter(v => v.metadata.agent_id === id).map(v => v.metadata.time_committed_secs)) + 1;
    const configuration = structuredClone({ ...plan.merged, branch_id: branchId, version_id: versionId, main_branch_id: this.agent(id).mainBranch?.id,
      metadata: { ...plan.merged.metadata, updated_at_unix_secs: time } });
    const previous = this.versions.get(plan.target.tip)!;
    const metadata: Version = { id: versionId, agent_id: id, branch_id: branchId, version_description: rebase ? "Local branch rebase" : "Local branch merge",
      seq_no_in_branch: previous.metadata.seq_no_in_branch + 1, time_committed_secs: time,
      parents: { in_branch_parent_id: plan.target.tip, out_of_branch_parent_id: plan.source.tip,
        ...(rebase ? { rebased_from_version_id: plan.source.tip } : { merged_from_branch_id: plan.source.metadata.id, merged_from_version_id: plan.source.tip }) },
      access_info: structuredClone(configuration.access_info) };
    this.versions.set(versionId, { metadata, configuration: structuredClone(configuration) });
    this.nextVersion = number;
    plan.target.tip = versionId;
    plan.target.metadata.last_committed_at = time;
    if (this.agent(id).mainBranch?.id === branchId) this.agent(id).configuration = configuration;
    if (archive) plan.source.metadata.is_archived = true;
    return { version_id: versionId, branch_id: branchId };
  }
  merge(id: string, sourceId: string, targetId: string, input: unknown = {}) {
    if (!object(input) || Object.keys(input).some(key => !["force", "archive_source_branch"].includes(key)) || Object.values(input).some(value => typeof value !== "boolean")) return invalid();
    return this.commitPlan(id, this.plan(id, sourceId, targetId, input.force === true, false), false, input.archive_source_branch !== false);
  }
  rebase(id: string, targetId: string, sourceId: string | null | undefined, input: unknown = {}) {
    if (!object(input) || Object.keys(input).length) return invalid();
    const from = sourceId ?? this.agent(id).mainBranch?.id;
    if (!from) return fail(404, "branch_not_found");
    return this.commitPlan(id, this.plan(id, from, targetId, false, true), true, false);
  }
  deleteDraft(id: string, branchId: string) {
    this.branch(id, branchId);
    this.clearProcedureDrafts?.(id, branchId);
    this.branch(id, branchId).draftCreatedAt = null;
    return {};
  }
}
