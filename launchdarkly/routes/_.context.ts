import type { Context$ } from "../types/_.context.js";
import type { Environment } from "../types/components/schemas/Environment.js";
import type { EnvironmentPost } from "../types/components/schemas/EnvironmentPost.js";
import type { FeatureFlag } from "../types/components/schemas/FeatureFlag.js";
import type { FeatureFlagBody } from "../types/components/schemas/FeatureFlagBody.js";
import type { FeatureFlagStatusAcrossEnvironments } from "../types/components/schemas/FeatureFlagStatusAcrossEnvironments.js";
import type { FlagStatusRep } from "../types/components/schemas/FlagStatusRep.js";
import type { PatchOperation } from "../types/components/schemas/PatchOperation.js";
import type { Project } from "../types/components/schemas/Project.js";
import type { ProjectPost } from "../types/components/schemas/ProjectPost.js";
import type { SegmentBody } from "../types/components/schemas/SegmentBody.js";
import type { UserSegment } from "../types/components/schemas/UserSegment.js";

export const SIMULATOR_TOKEN = "ld-simulator-token";
export const FIXED_TIMESTAMP = 1_735_689_600_000;
export const FIXED_DATE_TIME = "2025-01-01T00:00:00.000Z";

export type ErrorDetail = {
  code: string;
  message: string;
  [key: string]: unknown;
};

export class DomainError extends Error {
  readonly status: number;
  readonly detail: ErrorDetail;

  constructor(status: number, code: string, message: string, extra = {}) {
    super(message);
    this.name = "DomainError";
    this.status = status;
    this.detail = { code, message, ...extra };
  }

  toDetail(): ErrorDetail {
    return structuredClone(this.detail);
  }
}

export function domainErrorDetail(error: unknown): ErrorDetail {
  if (error instanceof DomainError) return error.toDetail();
  return { code: "internal_error", message: "Unexpected simulator error" };
}

export type JsonPatchInput = {
  patch: Array<PatchOperation>;
  comment?: string;
};

export type MergePatchInput = {
  merge: Record<string, unknown>;
  comment?: string;
};

export type SemanticInstruction = {
  kind: string;
  [key: string]: unknown;
};

export type SemanticPatchInput = {
  instructions: Array<SemanticInstruction>;
  environmentKey?: string;
  comment?: string;
};

export type FeatureFlagPatchInput =
  | JsonPatchInput
  | MergePatchInput
  | SemanticPatchInput;

export type PatchFlagOptions = {
  dryRun?: boolean;
  contentType?: string;
};

export type FlagEnvironmentConfig = {
  _environmentName: string;
  on: boolean;
  archived: boolean;
  version: number;
  lastModified: number;
  salt: string;
  sel: string;
  targets: Array<{
    contextKind: string;
    values: Array<string>;
    variation: number;
  }>;
  contextTargets: Array<{
    contextKind: string;
    values: Array<string>;
    variation: number;
  }>;
  rules: Array<Record<string, unknown>>;
  prerequisites: Array<Record<string, unknown>>;
  fallthrough: Record<string, unknown>;
  offVariation: number;
  trackEvents: boolean;
  trackEventsFallthrough: boolean;
  [key: string]: unknown;
};

export type ProjectState = {
  project: Project;
  environments: Record<string, Environment>;
  flags: Record<string, FeatureFlag>;
  segments: Record<string, Record<string, UserSegment>>;
};

export type SimulatorState = {
  projects: Record<string, ProjectState>;
};

const emptyState = (): SimulatorState => ({ projects: {} });
const link = (href: string) => ({ href, type: "application/json" });
const clone = <T>(value: T): T => structuredClone(value);

const invalid = (message: string, extra = {}): never => {
  throw new DomainError(400, "invalid_request", message, extra);
};

const notFound = (resource: string, key: string): never => {
  throw new DomainError(
    404,
    "not_found",
    `${resource} '${key}' was not found`,
    {
      resource,
      key,
    },
  );
};

const conflict = (resource: string, key: string): never => {
  throw new DomainError(
    409,
    "conflict",
    `${resource} '${key}' already exists`,
    {
      resource,
      key,
    },
  );
};

function requireString(value: unknown, field: string): string {
  if (typeof value !== "string" || value.length === 0) {
    invalid(`${field} must be a non-empty string`, { field });
  }
  return value as string;
}

function requireStringArray(value: unknown, field: string): Array<string> {
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
    invalid(`${field} must be an array of strings`, { field });
  }
  return value as Array<string>;
}

function decodePointer(path: string): Array<string> {
  if (path === "") return [];
  if (!path.startsWith("/")) invalid(`Invalid JSON pointer '${path}'`);
  return path
    .slice(1)
    .split("/")
    .map((part) => part.replaceAll("~1", "/").replaceAll("~0", "~"));
}

function assertSafePointer(parts: Array<string>): void {
  if (
    parts.some(
      (part) =>
        part === "__proto__" || part === "prototype" || part === "constructor",
    )
  ) {
    invalid("Unsafe JSON pointer");
  }
}

function arrayIndex(part: string, length: number, allowEnd: boolean): number {
  if (part === "-" && allowEnd) return length;
  if (!/^(0|[1-9]\d*)$/.test(part)) invalid(`Invalid array index '${part}'`);
  const index = Number(part);
  const maximum = allowEnd ? length : length - 1;
  if (index < 0 || index > maximum)
    invalid(`Array index '${part}' is out of range`);
  return index;
}

function locateParent(
  document: unknown,
  parts: Array<string>,
): { parent: Record<string, unknown> | Array<unknown>; key: string } {
  if (parts.length === 0)
    invalid("The document root cannot be patched directly");
  assertSafePointer(parts);
  let current: unknown = document;
  for (const part of parts.slice(0, -1)) {
    if (Array.isArray(current)) {
      current = current[arrayIndex(part, current.length, false)];
    } else if (
      current !== null &&
      typeof current === "object" &&
      Object.hasOwn(current, part)
    ) {
      current = (current as Record<string, unknown>)[part];
    } else {
      invalid("JSON pointer path does not exist");
    }
  }
  if (current === null || typeof current !== "object") {
    invalid("JSON pointer parent is not an object or array");
  }
  return {
    parent: current as Record<string, unknown> | Array<unknown>,
    key: parts.at(-1)!,
  };
}

function equalJson(left: unknown, right: unknown): boolean {
  return JSON.stringify(left) === JSON.stringify(right);
}

function applyJsonPatch<T>(document: T, operations: Array<PatchOperation>): T {
  if (!Array.isArray(operations)) invalid("patch must be an array");
  const candidate = clone(document);
  for (const operation of operations) {
    if (!operation || typeof operation !== "object") {
      invalid("Every JSON patch operation must be an object");
    }
    const op = requireString(operation.op, "op");
    const path = requireString(operation.path, "path");
    const { parent, key } = locateParent(candidate, decodePointer(path));
    if (Array.isArray(parent)) {
      if (op === "add") {
        parent.splice(
          arrayIndex(key, parent.length, true),
          0,
          clone(operation.value),
        );
      } else if (op === "remove") {
        parent.splice(arrayIndex(key, parent.length, false), 1);
      } else if (op === "replace") {
        parent[arrayIndex(key, parent.length, false)] = clone(operation.value);
      } else if (op === "test") {
        if (
          !equalJson(
            parent[arrayIndex(key, parent.length, false)],
            operation.value,
          )
        ) {
          invalid(`JSON patch test failed at '${path}'`);
        }
      } else {
        invalid(`Unsupported JSON patch operation '${op}'`);
      }
    } else {
      const exists = Object.hasOwn(parent, key);
      if (op === "add") {
        parent[key] = clone(operation.value);
      } else if (op === "remove") {
        if (!exists) invalid(`JSON pointer path '${path}' does not exist`);
        delete parent[key];
      } else if (op === "replace") {
        if (!exists) invalid(`JSON pointer path '${path}' does not exist`);
        parent[key] = clone(operation.value);
      } else if (op === "test") {
        if (!exists || !equalJson(parent[key], operation.value)) {
          invalid(`JSON patch test failed at '${path}'`);
        }
      } else {
        invalid(`Unsupported JSON patch operation '${op}'`);
      }
    }
  }
  return candidate;
}

function patchOperations(
  input: JsonPatchInput | Array<PatchOperation>,
): Array<PatchOperation> {
  return Array.isArray(input) ? input : input.patch;
}

function applyMergePatch(target: unknown, patch: unknown): unknown {
  if (patch === null || typeof patch !== "object" || Array.isArray(patch)) {
    return clone(patch);
  }
  const output: Record<string, unknown> =
    target !== null && typeof target === "object" && !Array.isArray(target)
      ? clone(target as Record<string, unknown>)
      : {};
  for (const [key, value] of Object.entries(patch)) {
    assertSafePointer([key]);
    if (value === null) delete output[key];
    else output[key] = applyMergePatch(output[key], value);
  }
  return output;
}

function flagConfig(
  flag: FeatureFlag,
  environmentKey: string,
): FlagEnvironmentConfig {
  const config = flag.environments[environmentKey];
  if (!config || typeof config !== "object")
    notFound("environment", environmentKey);
  return config as FlagEnvironmentConfig;
}

function variationIndex(flag: FeatureFlag, variationId: unknown): number {
  const id = requireString(variationId, "variationId");
  const index = flag.variations.findIndex((variation) => variation._id === id);
  if (index < 0)
    invalid(`Variation '${id}' was not found`, { variationId: id });
  return index;
}

function validateFlag(flag: FeatureFlag, originalKey: string): void {
  if (flag.key !== originalKey) invalid("Feature flag key is immutable");
  requireString(flag.name, "name");
  if (!Array.isArray(flag.variations) || flag.variations.length < 2) {
    invalid("A feature flag must have at least two variations");
  }
  if (!Array.isArray(flag.tags)) invalid("tags must be an array");
}

function requireSemanticEnvironment(
  project: ProjectState,
  flag: FeatureFlag,
  environmentKey: unknown,
): FlagEnvironmentConfig {
  const key = requireString(environmentKey, "environmentKey");
  if (!project.environments[key]) notFound("environment", key);
  return flagConfig(flag, key);
}

function semanticTargets(
  flag: FeatureFlag,
  config: FlagEnvironmentConfig,
  instruction: SemanticInstruction,
  remove: boolean,
): void {
  const index = variationIndex(flag, instruction.variationId);
  const values = requireStringArray(instruction.values, "values");
  const contextKind =
    instruction.contextKind === undefined
      ? "user"
      : requireString(instruction.contextKind, "contextKind");
  let target = config.targets.find(
    (entry) => entry.variation === index && entry.contextKind === contextKind,
  );
  if (remove) {
    if (!target) return;
    const removals = new Set(values);
    target.values = target.values.filter((value) => !removals.has(value));
    config.targets = config.targets.filter((entry) => entry.values.length > 0);
    return;
  }
  for (const other of config.targets) {
    if (
      other.contextKind === contextKind &&
      other.variation !== index &&
      other.values.some((value) => values.includes(value))
    ) {
      invalid("A context cannot be targeted by multiple variations");
    }
  }
  if (!target) {
    target = { contextKind, variation: index, values: [] };
    config.targets.push(target);
  }
  target.values = [...new Set([...target.values, ...values])];
}

function applySemanticPatch(
  project: ProjectState,
  flag: FeatureFlag,
  input: SemanticPatchInput,
): { flag: FeatureFlag; deleted: boolean } {
  if (!Array.isArray(input.instructions) || input.instructions.length === 0) {
    invalid("instructions must be a non-empty array");
  }
  if (
    input.instructions.some(
      (instruction) => instruction.kind === "deleteFlag",
    ) &&
    input.instructions.length !== 1
  ) {
    invalid("deleteFlag must be the only semantic instruction");
  }
  let deleted = false;
  for (const instruction of input.instructions) {
    if (!instruction || typeof instruction !== "object") {
      invalid("Every semantic instruction must be an object");
    }
    const kind = requireString(instruction.kind, "kind");
    switch (kind) {
      case "turnFlagOn":
      case "turnFlagOff": {
        const config = requireSemanticEnvironment(
          project,
          flag,
          input.environmentKey,
        );
        config.on = kind === "turnFlagOn";
        break;
      }
      case "updateName":
        flag.name = requireString(instruction.value, "value");
        break;
      case "updateDescription":
        flag.description = requireString(instruction.value, "value");
        break;
      case "addTags": {
        const values = requireStringArray(instruction.values, "values");
        flag.tags = [...new Set([...flag.tags, ...values])];
        break;
      }
      case "removeTags": {
        const values = new Set(
          requireStringArray(instruction.values, "values"),
        );
        flag.tags = flag.tags.filter((tag) => !values.has(tag));
        break;
      }
      case "updateVariation": {
        const variation =
          flag.variations[variationIndex(flag, instruction.variationId)]!;
        if (
          !Object.hasOwn(instruction, "value") &&
          !Object.hasOwn(instruction, "name") &&
          !Object.hasOwn(instruction, "description")
        ) {
          invalid("updateVariation requires value, name, or description");
        }
        if (Object.hasOwn(instruction, "value"))
          variation.value = clone(instruction.value);
        if (Object.hasOwn(instruction, "name"))
          variation.name = requireString(instruction.name, "name");
        if (Object.hasOwn(instruction, "description")) {
          variation.description = requireString(
            instruction.description,
            "description",
          );
        }
        break;
      }
      case "updateFallthrough": {
        const config = requireSemanticEnvironment(
          project,
          flag,
          input.environmentKey,
        );
        if (instruction.variationId !== undefined) {
          config.fallthrough = {
            variation: variationIndex(flag, instruction.variationId),
          };
        } else if (
          instruction.rolloutWeights &&
          typeof instruction.rolloutWeights === "object"
        ) {
          const variations = Object.entries(instruction.rolloutWeights).map(
            ([id, weight]) => {
              if (
                typeof weight !== "number" ||
                weight < 0 ||
                weight > 100_000
              ) {
                invalid("rollout weights must be numbers from 0 to 100000");
              }
              return { variation: variationIndex(flag, id), weight };
            },
          );
          if (
            variations.reduce((sum, item) => sum + item.weight, 0) !== 100_000
          ) {
            invalid("rollout weights must total 100000");
          }
          config.fallthrough = {
            rollout: {
              variations,
              bucketBy: instruction.rolloutBucketBy ?? "key",
              contextKind: instruction.rolloutContextKind ?? "user",
            },
          };
        } else {
          invalid("updateFallthrough requires variationId or rolloutWeights");
        }
        break;
      }
      case "updateOffVariation": {
        const config = requireSemanticEnvironment(
          project,
          flag,
          input.environmentKey,
        );
        config.offVariation = variationIndex(flag, instruction.variationId);
        break;
      }
      case "addTargets": {
        const config = requireSemanticEnvironment(
          project,
          flag,
          input.environmentKey,
        );
        semanticTargets(flag, config, instruction, false);
        break;
      }
      case "removeTargets": {
        const config = requireSemanticEnvironment(
          project,
          flag,
          input.environmentKey,
        );
        semanticTargets(flag, config, instruction, true);
        break;
      }
      case "archiveFlag":
        flag.archived = true;
        flag.archivedDate = FIXED_TIMESTAMP;
        for (const config of Object.values(flag.environments)) {
          (config as FlagEnvironmentConfig).archived = true;
        }
        break;
      case "restoreFlag":
        flag.archived = false;
        delete flag.archivedDate;
        for (const config of Object.values(flag.environments)) {
          (config as FlagEnvironmentConfig).archived = false;
        }
        break;
      case "deleteFlag":
        deleted = true;
        break;
      default:
        invalid(`Unsupported semantic instruction '${kind}'`, { kind });
    }
  }
  return { flag, deleted };
}

function createEnvironmentRecord(
  projectKey: string,
  body: EnvironmentPost,
): Environment {
  return {
    _links: {
      self: link(`/api/v2/projects/${projectKey}/environments/${body.key}`),
    },
    _id: `env-${projectKey}-${body.key}`,
    key: body.key,
    name: body.name,
    apiKey: `sdk-${projectKey}-${body.key}`,
    mobileKey: `mob-${projectKey}-${body.key}`,
    color: body.color,
    defaultTtl: body.defaultTtl ?? 5,
    secureMode: body.secureMode ?? false,
    defaultTrackEvents: body.defaultTrackEvents ?? false,
    requireComments: body.requireComments ?? false,
    confirmChanges: body.confirmChanges ?? false,
    tags: clone(body.tags ?? []),
    critical: body.critical ?? false,
  };
}

function createFlagEnvironment(
  environment: Environment,
  flagKey: string,
  offVariation: number,
): FlagEnvironmentConfig {
  return {
    _environmentName: environment.name,
    on: false,
    archived: false,
    version: 1,
    lastModified: FIXED_TIMESTAMP,
    salt: `salt-${flagKey}-${environment.key}`,
    sel: `sel-${flagKey}-${environment.key}`,
    targets: [],
    contextTargets: [],
    rules: [],
    prerequisites: [],
    fallthrough: { variation: 0 },
    offVariation,
    trackEvents: false,
    trackEventsFallthrough: false,
  };
}

export class Context {
  public state: SimulatorState = emptyState();

  constructor($: Context$) {
    void $;
  }

  reset(nextState: SimulatorState = emptyState()): void {
    this.state = clone(nextState);
  }

  isAuthorized(token: unknown): boolean {
    return token === SIMULATOR_TOKEN;
  }

  listProjects(): Array<Project> {
    return clone(
      Object.values(this.state.projects).map(({ project }) => project),
    );
  }

  getProject(key: string): Project {
    return clone(this.requireProject(key).project);
  }

  createProject(body: ProjectPost): Project {
    requireString(body.key, "key");
    requireString(body.name, "name");
    if (this.state.projects[body.key]) conflict("project", body.key);
    const project: Project = {
      _links: {
        self: link(`/api/v2/projects/${body.key}`),
        environments: link(`/api/v2/projects/${body.key}/environments`),
      },
      _id: `project-${body.key}`,
      key: body.key,
      name: body.name,
      includeInSnippetByDefault: body.includeInSnippetByDefault ?? false,
      tags: clone(body.tags ?? []),
      ...(body.defaultClientSideAvailability
        ? {
            defaultClientSideAvailability: clone(
              body.defaultClientSideAvailability,
            ),
          }
        : {}),
    };
    const projectState: ProjectState = {
      project,
      environments: {},
      flags: {},
      segments: {},
    };
    this.state.projects[body.key] = projectState;
    const environments = body.environments ?? [
      {
        key: "production",
        name: "Production",
        color: "2f80ed",
        critical: true,
      },
      { key: "test", name: "Test", color: "f2c94c" },
    ];
    for (const environmentBody of environments)
      this.createEnvironment(body.key, environmentBody);
    return clone(project);
  }

  patchProject(
    key: string,
    input: JsonPatchInput | Array<PatchOperation>,
  ): Project {
    const projectState = this.requireProject(key);
    const candidate = applyJsonPatch(
      projectState.project,
      patchOperations(input),
    );
    if (candidate.key !== key) invalid("Project key is immutable");
    requireString(candidate.name, "name");
    projectState.project = candidate;
    return clone(candidate);
  }

  deleteProject(key: string): void {
    this.requireProject(key);
    if (Object.keys(this.state.projects).length === 1)
      invalid("The last project cannot be deleted");
    delete this.state.projects[key];
  }

  listEnvironments(projectKey: string): Array<Environment> {
    return clone(Object.values(this.requireProject(projectKey).environments));
  }

  getEnvironment(projectKey: string, environmentKey: string): Environment {
    const environment =
      this.requireProject(projectKey).environments[environmentKey];
    if (!environment) notFound("environment", environmentKey);
    return clone(environment);
  }

  createEnvironment(projectKey: string, body: EnvironmentPost): Environment {
    const project = this.requireProject(projectKey);
    requireString(body.key, "key");
    requireString(body.name, "name");
    requireString(body.color, "color");
    if (project.environments[body.key]) conflict("environment", body.key);
    const environment = createEnvironmentRecord(projectKey, body);
    project.environments[body.key] = environment;
    project.segments[body.key] = {};
    for (const flag of Object.values(project.flags)) {
      flag.environments[body.key] = createFlagEnvironment(
        environment,
        flag.key,
        Math.max(flag.variations.length - 1, 0),
      );
      flag._version += 1;
    }
    return clone(environment);
  }

  patchEnvironment(
    projectKey: string,
    environmentKey: string,
    input: JsonPatchInput | Array<PatchOperation>,
  ): Environment {
    const project = this.requireProject(projectKey);
    const current = project.environments[environmentKey];
    if (!current) notFound("environment", environmentKey);
    const candidate = applyJsonPatch(current, patchOperations(input));
    if (candidate.key !== environmentKey)
      invalid("Environment key is immutable");
    requireString(candidate.name, "name");
    project.environments[environmentKey] = candidate;
    for (const flag of Object.values(project.flags)) {
      flagConfig(flag, environmentKey)._environmentName = candidate.name;
    }
    return clone(candidate);
  }

  deleteEnvironment(projectKey: string, environmentKey: string): void {
    const project = this.requireProject(projectKey);
    if (!project.environments[environmentKey])
      notFound("environment", environmentKey);
    if (Object.keys(project.environments).length === 1)
      invalid("The last environment cannot be deleted");
    delete project.environments[environmentKey];
    delete project.segments[environmentKey];
    for (const flag of Object.values(project.flags)) {
      delete flag.environments[environmentKey];
      flag._version += 1;
    }
  }

  listFlags(projectKey: string): Array<FeatureFlag> {
    return clone(Object.values(this.requireProject(projectKey).flags));
  }

  getFlag(projectKey: string, flagKey: string): FeatureFlag {
    return clone(this.requireFlag(projectKey, flagKey));
  }

  createFlag(projectKey: string, body: FeatureFlagBody): FeatureFlag {
    const project = this.requireProject(projectKey);
    requireString(body.key, "key");
    requireString(body.name, "name");
    if (project.flags[body.key]) conflict("feature flag", body.key);
    const variations = clone(
      body.variations ?? [{ value: true }, { value: false }],
    ).map((variation, index) => ({
      ...variation,
      _id: variation._id ?? `${body.key}-variation-${index}`,
    }));
    const defaults = body.defaults ?? {
      onVariation: 0,
      offVariation: variations.length - 1,
    };
    const environments = Object.fromEntries(
      Object.values(project.environments).map((environment) => [
        environment.key,
        createFlagEnvironment(
          environment,
          body.key,
          defaults.offVariation ?? variations.length - 1,
        ),
      ]),
    );
    const flag: FeatureFlag = {
      name: body.name,
      key: body.key,
      kind:
        variations.length === 2 &&
        variations[0]?.value === true &&
        variations[1]?.value === false
          ? "boolean"
          : "multivariate",
      ...(body.description === undefined
        ? {}
        : { description: body.description }),
      _version: 1,
      creationDate: FIXED_TIMESTAMP,
      clientSideAvailability: clone(
        body.clientSideAvailability ?? {
          usingMobileKey: false,
          usingEnvironmentId: false,
        },
      ),
      variations,
      temporary: body.temporary ?? true,
      tags: clone(body.tags ?? []),
      _links: {
        parent: link(`/api/v2/flags/${projectKey}`),
        self: link(`/api/v2/flags/${projectKey}/${body.key}`),
      },
      experiments: { baselineIdx: 0, items: [] },
      customProperties: clone(body.customProperties ?? {}),
      archived: false,
      deprecated: false,
      defaults: clone(defaults),
      environments,
    };
    validateFlag(flag, body.key);
    project.flags[body.key] = flag;
    return clone(flag);
  }

  patchFlag(
    projectKey: string,
    flagKey: string,
    input: FeatureFlagPatchInput,
    options: PatchFlagOptions = {},
  ): FeatureFlag {
    const project = this.requireProject(projectKey);
    const original = this.requireFlag(projectKey, flagKey);
    const contentType = options.contentType?.toLowerCase();
    let candidate = clone(original);
    let deleted = false;
    if ("instructions" in input) {
      if (
        contentType &&
        !contentType.includes("domain-model=launchdarkly.semanticpatch")
      ) {
        invalid(
          "Semantic patches require the LaunchDarkly semantic patch content type",
        );
      }
      ({ flag: candidate, deleted } = applySemanticPatch(
        project,
        candidate,
        input,
      ));
    } else if ("merge" in input) {
      if (contentType && !contentType.includes("merge-patch+json")) {
        invalid("Merge patches require application/merge-patch+json");
      }
      candidate = applyMergePatch(candidate, input.merge) as FeatureFlag;
    } else if ("patch" in input) {
      candidate = applyJsonPatch(candidate, input.patch);
    } else {
      invalid("Feature flag patch body is not recognized");
    }
    validateFlag(candidate, flagKey);
    if (!options.dryRun) {
      candidate._version = original._version + 1;
      for (const config of Object.values(candidate.environments)) {
        const typedConfig = config as FlagEnvironmentConfig;
        typedConfig.version += 1;
        typedConfig.lastModified = FIXED_TIMESTAMP;
      }
      if (deleted) delete project.flags[flagKey];
      else project.flags[flagKey] = candidate;
    }
    return clone(candidate);
  }

  deleteFlag(projectKey: string, flagKey: string): void {
    const project = this.requireProject(projectKey);
    this.requireFlag(projectKey, flagKey);
    delete project.flags[flagKey];
  }

  listSegments(projectKey: string, environmentKey: string): Array<UserSegment> {
    return clone(
      Object.values(this.requireSegments(projectKey, environmentKey)),
    );
  }

  getSegment(
    projectKey: string,
    environmentKey: string,
    segmentKey: string,
  ): UserSegment {
    const segment = this.requireSegments(projectKey, environmentKey)[
      segmentKey
    ];
    if (!segment) notFound("segment", segmentKey);
    return clone(segment);
  }

  createSegment(
    projectKey: string,
    environmentKey: string,
    body: SegmentBody,
  ): UserSegment {
    const segments = this.requireSegments(projectKey, environmentKey);
    requireString(body.key, "key");
    requireString(body.name, "name");
    if (body.unbounded) invalid("Only standard segments are supported");
    if (segments[body.key]) conflict("segment", body.key);
    const segment: UserSegment = {
      name: body.name,
      ...(body.description === undefined
        ? {}
        : { description: body.description }),
      tags: clone(body.tags ?? []),
      creationDate: FIXED_TIMESTAMP,
      lastModifiedDate: FIXED_TIMESTAMP,
      key: body.key,
      included: [],
      excluded: [],
      includedContexts: [],
      excludedContexts: [],
      _links: {
        self: link(
          `/api/v2/segments/${projectKey}/${environmentKey}/${body.key}`,
        ),
      },
      rules: [],
      version: 1,
      deleted: false,
      unbounded: false,
      generation: 0,
    };
    segments[body.key] = segment;
    return clone(segment);
  }

  patchSegment(
    projectKey: string,
    environmentKey: string,
    segmentKey: string,
    input: JsonPatchInput | Array<PatchOperation>,
  ): UserSegment {
    const segments = this.requireSegments(projectKey, environmentKey);
    const current = segments[segmentKey];
    if (!current) notFound("segment", segmentKey);
    const candidate = applyJsonPatch(current, patchOperations(input));
    if (candidate.key !== segmentKey) invalid("Segment key is immutable");
    if (candidate.unbounded) invalid("Only standard segments are supported");
    requireString(candidate.name, "name");
    candidate.version = current.version + 1;
    candidate.lastModifiedDate = FIXED_TIMESTAMP;
    segments[segmentKey] = candidate;
    return clone(candidate);
  }

  deleteSegment(
    projectKey: string,
    environmentKey: string,
    segmentKey: string,
  ): void {
    const segments = this.requireSegments(projectKey, environmentKey);
    if (!segments[segmentKey]) notFound("segment", segmentKey);
    delete segments[segmentKey];
  }

  listFlagStatuses(
    projectKey: string,
    environmentKey: string,
  ): Array<FlagStatusRep> {
    const project = this.requireProject(projectKey);
    this.getEnvironment(projectKey, environmentKey);
    return clone(
      Object.values(project.flags).map((flag) =>
        this.statusFor(projectKey, environmentKey, flag),
      ),
    );
  }

  getFlagStatus(
    projectKey: string,
    environmentKey: string,
    flagKey: string,
  ): FlagStatusRep {
    this.getEnvironment(projectKey, environmentKey);
    return clone(
      this.statusFor(
        projectKey,
        environmentKey,
        this.requireFlag(projectKey, flagKey),
      ),
    );
  }

  getFlagStatusesAcrossEnvironments(
    projectKey: string,
    flagKey: string,
  ): FeatureFlagStatusAcrossEnvironments {
    const project = this.requireProject(projectKey);
    const flag = this.requireFlag(projectKey, flagKey);
    return clone({
      key: flagKey,
      _links: {
        parent: link("/api/v2/flag-status"),
        self: link(`/api/v2/flag-status/${projectKey}/${flagKey}`),
      },
      environments: Object.fromEntries(
        Object.keys(project.environments).map((environmentKey) => [
          environmentKey,
          this.statusFor(projectKey, environmentKey, flag),
        ]),
      ),
    });
  }

  private requireProject(key: string): ProjectState {
    const project = this.state.projects[key];
    if (!project) notFound("project", key);
    return project;
  }

  private requireFlag(projectKey: string, flagKey: string): FeatureFlag {
    const flag = this.requireProject(projectKey).flags[flagKey];
    if (!flag) notFound("feature flag", flagKey);
    return flag;
  }

  private requireSegments(
    projectKey: string,
    environmentKey: string,
  ): Record<string, UserSegment> {
    const project = this.requireProject(projectKey);
    if (!project.environments[environmentKey])
      notFound("environment", environmentKey);
    return (project.segments[environmentKey] ??= {});
  }

  private statusFor(
    projectKey: string,
    environmentKey: string,
    flag: FeatureFlag,
  ): FlagStatusRep {
    const config = flagConfig(flag, environmentKey);
    const offVariation = flag.variations[config.offVariation];
    return {
      _links: {
        parent: link(`/api/v2/flags/${projectKey}/${flag.key}`),
        self: link(
          `/api/v2/flag-statuses/${projectKey}/${environmentKey}/${flag.key}`,
        ),
      },
      name: !flag.archived && config.on ? "active" : "inactive",
      lastRequested: FIXED_DATE_TIME,
      default: offVariation?.value,
    };
  }
}
