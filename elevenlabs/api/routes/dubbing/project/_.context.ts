import {
  creationObject,
  creationLanguage,
  creationSource,
  type CreationDefaults,
  type DubbingInput,
} from "../_.context.js";
import type { MultipartFile } from "../../../counterfact-types/index.js";
import type { DubbingProjectResponse } from "../../../types/v1/components/schemas/DubbingProjectResponse.js";
import type { DubbingLanguageResponse } from "../../../types/v1/components/schemas/DubbingLanguageResponse.js";
import type { DubbingTranscriptSegment } from "../../../types/v1/components/schemas/DubbingTranscriptSegment.js";
export type StoredLanguage = {
  metadata: DubbingLanguageResponse;
  translations: Map<string, string | null>;
};
export type StoredProject = {
  input?: DubbingInput;
  metadata: DubbingProjectResponse;
  segments: Map<string, DubbingTranscriptSegment>;
  languages: Map<string, StoredLanguage>;
};
type Obj = Record<string, unknown>;
const object = (v: unknown): v is Obj =>
  !!v && typeof v === "object" && !Array.isArray(v);
export class DubbingProjectError extends Error {
  override name = "DubbingProjectError";
  constructor(
    public status: number,
    public code: string,
    message: string,
  ) {
    super(message);
  }
}
const fail = (status: number, code: string, message: string): never => {
  throw new DubbingProjectError(status, code, message);
};
const invalid = (): never =>
  fail(
    400,
    "invalid_dubbing_request",
    "Invalid local dubbing metadata request",
  );
const clone = <T>(v: T): T => structuredClone(v);
export class Context {
  defaults?: CreationDefaults;
  sources = new Map<string, MultipartFile>();
  nextProjectId = 0;
  create(v: unknown) {
    if (
      !creationObject(v) ||
      Object.keys(v).some(
        (k) =>
          ![
            "file",
            "source_url",
            "reference",
            "source_language",
            "model_id",
            "target_language",
            "transcript",
            "keyterms",
            "webhook_ids",
          ].includes(k),
      ) ||
      (v.reference != null &&
        (typeof v.reference !== "string" || v.reference.length > 500))
    )
      return invalid();
    if (
      (v.model_id != null &&
        (typeof v.model_id !== "string" ||
          !["dubbing_v1", "dubbing_v2"].includes(v.model_id))) ||
      v.transcript != null ||
      ["keyterms", "webhook_ids"].some(
        (k) =>
          v[k] != null && (!Array.isArray(v[k]) || (v[k] as unknown[]).length),
      )
    )
      return fail(
        400,
        "unsupported_dubbing_option",
        "Option is outside the bounded synthetic workflow",
      );
    let sourceLanguage: string | undefined,
      target: string | undefined,
      input: DubbingInput;
    try {
      sourceLanguage = creationLanguage(v.source_language);
      target = creationLanguage(v.target_language);
      input = creationSource(v, this.defaults, this.sources);
    } catch (error) {
      if (error instanceof Error && error.name === "LegacyDubbingError") {
        const e = error as Error & { status: number; code: string };
        return fail(e.status, e.code, e.message);
      }
      throw error;
    }
    let n = this.nextProjectId,
      id: string;
    do {
      id = `sim-dubbing-project-created-${++n}`;
    } while (this.projects.has(id));
    const metadata: DubbingProjectResponse = {
      project_id: id,
      status: "queued",
      reference: (v.reference as string | null) ?? null,
      source_language: sourceLanguage ?? null,
      model_id: (v.model_id as string | null) ?? "dubbing_v2",
      media: null,
      language_ids: [],
      webhook_ids: [],
      revision: 0,
      error: null,
      warnings: [],
      created_at: this.defaults!.timestamp,
      updated_at: this.defaults!.timestamp,
    };
    this.projects.set(id, {
      input,
      metadata,
      segments: new Map(),
      languages: new Map(),
    });
    if (target) this.createLanguage(id, { target_language: v.target_language });
    this.nextProjectId = n;
    return this.project(id);
  }

  editedSegments = new Map<string, Set<string>>();
  regenerations = new Map<string, {projectId: string; languageId: string; revision: number; segments: DubbingTranscriptSegment[]; translations: Map<string, string | null>}>();
  regenerate(pid: string, lid: string) {
    const p = this.ready(pid), l = this.available(pid, lid);
    if (l.metadata.status !== "stale") fail(409, "dubbing_no_edits", "No edits to regenerate");
    const dirty = this.editedSegments.get(`${pid}/${lid}`);
    const segments = this.ordered(p).filter(s => dirty?.has(s.id));
    if (!segments.length || segments.some(s => !l.translations.get(s.id))) return invalid();
    const seconds = segments.reduce((n, s) => n + s.end_s - s.start_s, 0);
    // A bounded local queue has zero quota cost and no provider billing.
    this.regenerations.set(`${pid}/${lid}`, {projectId: pid, languageId: lid, revision: l.metadata.revision, segments: clone(segments), translations: clone(l.translations)});
    l.metadata.status = "processing";
    return {regenerated_segment_ids: segments.map(s => s.id), regenerated_seconds: seconds, charged_seconds: 0, free_regeneration_seconds_remaining: 0};
  }
  projects = new Map<string, StoredProject>();
  nextSegmentId = 1;
  nextLanguageId = 1;
  timestamp = "";
  private stored(id: string) {
    return (
      this.projects.get(id) ??
      fail(404, "dubbing_project_not_found", "Project not found")
    );
  }
  private ready(id: string) {
    const p = this.stored(id);
    if ([...this.regenerations.values()].some(j => j.projectId === id)) fail(409, "dubbing_processing", "Project processing");
    if (p.metadata.status !== "ready")
      fail(409, "dubbing_project_not_ready", "Source transcript not ready");
    return p;
  }
  private target(pid: string, lid: string) {
    return (
      this.stored(pid).languages.get(lid) ??
      fail(404, "dubbing_language_not_found", "Language target not found")
    );
  }
  private available(pid: string, lid: string) {
    const l = this.target(pid, lid);
    if (l.metadata.status === "processing") fail(409, "dubbing_processing", "Language processing");
    if (l.metadata.output_revision == null)
      fail(
        409,
        "dubbing_transcript_not_ready",
        "Target has not produced an output",
      );
    return l;
  }
  private ordered(p: StoredProject) {
    return [...p.segments.values()].sort(
      (a, b) => a.start_s - b.start_s || a.id.localeCompare(b.id),
    );
  }
  private page<T>(rows: T[], q: Obj) {
    const size = q.page_size ?? 20,
      cursor = q.cursor ?? "0";
    if (
      !Number.isInteger(size) ||
      typeof cursor !== "string" ||
      !/^\d+$/.test(cursor) ||
      !Number.isSafeInteger(Number(cursor))
    )
      return invalid();
    const count = Math.max(1, Math.min(100, Number(size))),
      offset = Number(cursor),
      values = rows.slice(offset, offset + count);
    return {
      values: clone(values),
      next_cursor:
        offset + values.length < rows.length
          ? String(offset + values.length)
          : null,
    };
  }
  project(id: string) {
    const p = this.stored(id);
    return clone({ ...p.metadata, language_ids: [...p.languages.keys()] });
  }
  listProjects(q: Obj) {
    if (
      q.status != null &&
      !["queued", "preparing", "ready", "failed"].includes(String(q.status))
    )
      return invalid();
    const direction = q.sort_direction ?? "DESCENDING";
    if (!["ASCENDING", "DESCENDING"].includes(String(direction)))
      return invalid();
    const rows = [...this.projects.values()]
      .map((p) => ({ ...p.metadata, language_ids: [] }))
      .filter((p) => q.status == null || p.status === q.status)
      .sort(
        (a, b) =>
          (direction === "ASCENDING" ? 1 : -1) *
            a.created_at.localeCompare(b.created_at) ||
          a.project_id.localeCompare(b.project_id),
      );
    const { values, next_cursor } = this.page(rows, q);
    return { projects: values, next_cursor };
  }
  deleteProject(id: string) {
    this.stored(id);
    this.projects.delete(id);
    for (const [key, j] of this.regenerations) if (j.projectId === id) this.regenerations.delete(key);
    for (const key of this.editedSegments.keys()) if (key.startsWith(`${id}/`)) this.editedSegments.delete(key);
  }
  language(pid: string, lid: string) {
    return clone(this.target(pid, lid).metadata);
  }
  listLanguages(pid: string, q: Obj) {
    const p = this.stored(pid);
    if (
      q.status != null &&
      !["queued", "processing", "completed", "stale", "failed"].includes(
        String(q.status),
      )
    )
      return invalid();
    const rows = [...p.languages.values()]
      .map((l) => l.metadata)
      .filter((l) => q.status == null || l.status === q.status)
      .sort(
        (a, b) =>
          b.created_at.localeCompare(a.created_at) ||
          a.language_id.localeCompare(b.language_id),
      );
    const { values, next_cursor } = this.page(rows, q);
    return { languages: values, next_cursor };
  }
  createLanguage(pid: string, v: unknown) {
    const p = this.stored(pid);
    if (
      !object(v) ||
      Object.keys(v).some(
        (k) =>
          !["target_language", "voice_settings", "translations"].includes(k),
      ) ||
      typeof v.target_language !== "string" ||
      !/^[A-Za-z]{2,3}(?:-[A-Za-z0-9]{2,8})*$/.test(v.target_language)
    )
      return invalid();
    if (
      v.voice_settings != null &&
      (!object(v.voice_settings) ||
        (v.voice_settings.cloning_strength != null &&
          (!Number.isInteger(v.voice_settings.cloning_strength) ||
            Number(v.voice_settings.cloning_strength) < 0 ||
            Number(v.voice_settings.cloning_strength) > 10)))
    )
      return invalid();
    const translations = new Map<string, string | null>();
    if (v.translations != null) {
      if (
        p.metadata.status !== "ready" ||
        !object(v.translations) ||
        Object.keys(v.translations).length !== p.segments.size
      )
        return invalid();
      const expected = new Set(
        [...p.segments.values()].map((s) => s.external_id ?? s.id),
      );
      if (
        expected.size !== p.segments.size ||
        Object.keys(v.translations).some((k) => !expected.has(k)) ||
        Object.values(v.translations).some((t) => typeof t !== "string") ||
        Buffer.byteLength(JSON.stringify(v.translations)) > 4 * 1024 * 1024
      )
        return invalid();
      for (const s of p.segments.values())
        translations.set(s.id, v.translations[s.external_id ?? s.id] as string);
    }
    const id = `sim-dubbing-language-created-${this.nextLanguageId++}`;
    const metadata: DubbingLanguageResponse = {
      language_id: id,
      project_id: pid,
      target_language: v.target_language,
      status: "queued",
      model_id: p.metadata.model_id ?? null,
      voice_settings: v.voice_settings == null ? null : clone(v.voice_settings),
      outputs: null,
      output_revision: null,
      revision: 0,
      error: null,
      warnings: [],
      created_at: this.timestamp,
      updated_at: this.timestamp,
    };
    p.languages.set(id, { metadata, translations });
    return clone(metadata);
  }
  deleteLanguage(pid: string, lid: string) {
    this.target(pid, lid);
    this.stored(pid).languages.delete(lid);
    this.regenerations.delete(`${pid}/${lid}`);
    this.editedSegments.delete(`${pid}/${lid}`);
  }
  sourceTranscript(pid: string) {
    const p = this.ready(pid);
    return {
      language: p.metadata.source_language ?? null,
      segments: clone(this.ordered(p)),
      revision: p.metadata.revision,
    };
  }
  private projectTarget(
    p: StoredProject,
    l: StoredLanguage,
    s: DubbingTranscriptSegment,
  ) {
    return {
      id: s.id,
      speaker_id: s.speaker_id,
      start_s: s.start_s,
      end_s: s.end_s,
      source_text: s.text,
      translation: l.translations.get(s.id) ?? null,
    };
  }
  targetTranscript(pid: string, lid: string) {
    const p = this.stored(pid),
      l = this.available(pid, lid);
    return {
      source_language: p.metadata.source_language ?? null,
      target_language: l.metadata.target_language,
      segments: this.ordered(p).map((s) => this.projectTarget(p, l, s)),
      revision: l.metadata.revision,
    };
  }
  private validateSegments(
    p: StoredProject,
    segments: Map<string, DubbingTranscriptSegment>,
  ) {
    const duration = p.metadata.media?.duration_s;
    if (duration == null)
      return fail(
        409,
        "dubbing_media_not_ready",
        "Source duration unavailable",
      );
    const rows = [...segments.values()];
    if (rows.length > 20000) return invalid();
    for (const s of rows) {
      if (
        typeof s.text !== "string" ||
        typeof s.speaker_id !== "string" ||
        !s.speaker_id.trim() ||
        !Number.isFinite(s.start_s) ||
        !Number.isFinite(s.end_s) ||
        s.start_s < 0 ||
        s.end_s > duration ||
        s.end_s - s.start_s < 0.1 - 1e-9 ||
        s.end_s - s.start_s > 25
      )
        return invalid();
    }
    for (let i = 0; i < rows.length; i++)
      for (let j = i + 1; j < rows.length; j++)
        if (
          rows[i].speaker_id === rows[j].speaker_id &&
          rows[i].start_s < rows[j].end_s &&
          rows[j].start_s < rows[i].end_s
        )
          return invalid();
  }
  private sourceChanged(p: StoredProject, affected: string[]) {
    p.metadata.revision++;
    p.metadata.updated_at = this.timestamp;
    for (const l of p.languages.values()) {
      const key = `${p.metadata.project_id}/${l.metadata.language_id}`;
      const dirty = this.editedSegments.get(key) ?? new Set<string>();
      for (const id of affected) dirty.add(id);
      this.editedSegments.set(key, dirty);
      for (const id of affected) l.translations.delete(id);
      l.metadata.revision++;
      l.metadata.updated_at = this.timestamp;
      if (l.metadata.status === "completed") l.metadata.status = "stale";
    }
  }
  private edits(v: unknown) {
    if (
      !object(v) ||
      Object.keys(v).length < 1 ||
      Object.keys(v).length > 500 ||
      Object.values(v).some((e) => !object(e))
    )
      return invalid();
    return v as Record<string, Obj>;
  }
  updateSource(pid: string, v: unknown) {
    const p = this.ready(pid),
      edits = this.edits(v),
      next = clone(p.segments);
    for (const [id, e] of Object.entries(edits)) {
      const s =
        next.get(id) ??
        fail(404, "dubbing_segment_not_found", "Segment not found");
      if (
        Object.keys(e).some(
          (k) => !["text", "speaker_id", "start_s", "end_s"].includes(k),
        )
      )
        return invalid();
      for (const [k, value] of Object.entries(e))
        if (value != null) (s as unknown as Obj)[k] = value;
    }
    this.validateSegments(p, next);
    p.segments = next;
    this.sourceChanged(p, Object.keys(edits));
    return {
      segments: clone(Object.keys(edits).map((id) => next.get(id)!)),
      revision: p.metadata.revision,
    };
  }
  addSource(pid: string, v: unknown) {
    const p = this.ready(pid);
    if (
      !object(v) ||
      Object.keys(v).some(
        (k) => !["text", "speaker_id", "start_s", "end_s"].includes(k),
      )
    )
      return invalid();
    const id = `sim-dubbing-segment-created-${this.nextSegmentId}`,
      s = { ...clone(v), id } as DubbingTranscriptSegment,
      next = clone(p.segments);
    next.set(id, s);
    this.validateSegments(p, next);
    this.nextSegmentId++;
    p.segments = next;
    this.sourceChanged(p, [id]);
    return { segment: clone(s), revision: p.metadata.revision };
  }
  deleteSource(pid: string, id: string) {
    const p = this.ready(pid);
    if (!p.segments.has(id))
      fail(404, "dubbing_segment_not_found", "Segment not found");
    p.segments.delete(id);
    this.sourceChanged(p, [id]);
    return { revision: p.metadata.revision };
  }
  updateTarget(pid: string, lid: string, v: unknown) {
    const p = this.stored(pid),
      l = this.available(pid, lid),
      edits = this.edits(v),
      next = clone(l.translations);
    for (const [id, e] of Object.entries(edits)) {
      if (!p.segments.has(id))
        fail(404, "dubbing_segment_not_found", "Segment not found");
      if (
        Object.keys(e).some((k) => k !== "translation") ||
        (e.translation !== undefined &&
          e.translation !== null &&
          typeof e.translation !== "string")
      )
        return invalid();
      if (Object.hasOwn(e, "translation"))
        next.set(id, e.translation as string | null);
    }
    const key = `${pid}/${lid}`, dirty = this.editedSegments.get(key) ?? new Set<string>();
    for (const id of Object.keys(edits)) dirty.add(id);
    this.editedSegments.set(key, dirty);
    l.translations = next;
    l.metadata.revision++;
    l.metadata.updated_at = this.timestamp;
    if (l.metadata.status === "completed") l.metadata.status = "stale";
    return {
      segments: Object.keys(edits).map((id) =>
        this.projectTarget(p, l, p.segments.get(id)!),
      ),
      revision: l.metadata.revision,
    };
  }
}
