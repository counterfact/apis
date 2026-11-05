import type { ProjectExtendedResponseModel as Project } from "../../../types/v1/components/schemas/ProjectExtendedResponseModel.js";
import type { ProjectResponseModel as Summary } from "../../../types/v1/components/schemas/ProjectResponseModel.js";
import type { ChapterWithContentResponseModel as Chapter } from "../../../types/v1/components/schemas/ChapterWithContentResponseModel.js";
import type { ChapterResponseModel as ChapterSummary } from "../../../types/v1/components/schemas/ChapterResponseModel.js";
import type { PronunciationDictionaryVersionResponseModel as Version } from "../../../types/v1/components/schemas/PronunciationDictionaryVersionResponseModel.js";
type Obj = Record<string, unknown>;
export type StoredProject = {
  metadata: Omit<Project, "chapters">;
  chapters: Map<string, Chapter>;
  muted: Set<string>;
};
const object = (v: unknown): v is Obj =>
  !!v && typeof v === "object" && !Array.isArray(v);
const text = (v: unknown): v is string => typeof v === "string" && !!v.trim();
export class StudioError extends Error {
  override name = "StudioError";
  constructor(
    public status: number,
    public code: string,
    message: string,
  ) {
    super(message);
  }
}
const invalid = (): never => {
  throw new StudioError(
    400,
    "invalid_studio_request",
    "Invalid local Studio request",
  );
};
function input(v: unknown, allowed: string[]) {
  if (!object(v) || Object.keys(v).some((k) => !allowed.includes(k)))
    return invalid();
  return v;
}
export class Context {
  projects = new Map<string, StoredProject>();
  nextChapterId = 1;
  dictionaryVersion: (
    id: string,
    version: string | null,
  ) => Version | undefined = () => undefined;
  private stored(id: string) {
    const p = this.projects.get(id);
    if (!p)
      throw new StudioError(
        404,
        "studio_project_not_found",
        "Studio project not found",
      );
    return p;
  }
  private storedChapter(project: string, id: string) {
    const c = this.stored(project).chapters.get(id);
    if (!c)
      throw new StudioError(
        404,
        "studio_chapter_not_found",
        "Studio chapter not found",
      );
    return c;
  }
  private chapterSummary(c: Chapter): ChapterSummary {
    const { content: _, ...summary } = c;
    return structuredClone(summary);
  }
  private projectSummary(p: StoredProject): Summary {
    const {
      quality_preset: _,
      pronunciation_dictionary_versions: __,
      pronunciation_dictionary_locators: ___,
      apply_text_normalization: ____,
      experimental: _____,
      assets: ______,
      voices: _______,
      base_voices: ________,
      publishing_read: _________,
      ...summary
    } = p.metadata;
    return structuredClone(summary);
  }
  list() {
    return {
      projects: [...this.projects.values()]
        .sort(
          (a, b) =>
            b.metadata.create_date_unix - a.metadata.create_date_unix ||
            a.metadata.project_id.localeCompare(b.metadata.project_id),
        )
        .map((p) => this.projectSummary(p)),
    };
  }
  get(id: string): Project {
    const p = this.stored(id);
    return structuredClone({
      ...p.metadata,
      chapters: [...p.chapters.values()].map((c) => this.chapterSummary(c)),
    });
  }
  updateProject(id: string, value: unknown) {
    const p = this.stored(id),
      b = input(value, [
        "name",
        "default_title_voice_id",
        "default_paragraph_voice_id",
        "title",
        "author",
        "isbn_number",
        "volume_normalization",
      ]);
    for (const k of [
      "name",
      "default_title_voice_id",
      "default_paragraph_voice_id",
    ])
      if (!text(b[k])) return invalid();
    for (const k of ["title", "author", "isbn_number"])
      if (b[k] != null && typeof b[k] !== "string") return invalid();
    if (
      b.volume_normalization !== undefined &&
      typeof b.volume_normalization !== "boolean"
    )
      return invalid();
    const next = structuredClone(p.metadata);
    Object.assign(next, {
      name: b.name,
      default_title_voice_id: b.default_title_voice_id,
      default_title_voice_ref_id: b.default_title_voice_id,
      default_paragraph_voice_id: b.default_paragraph_voice_id,
      default_paragraph_voice_ref_id: b.default_paragraph_voice_id,
    });
    for (const k of ["title", "author", "isbn_number", "volume_normalization"])
      if (b[k] !== undefined) Object.assign(next, { [k]: b[k] });
    p.metadata = next;
    return { project: this.projectSummary(p) };
  }
  deleteProject(id: string) {
    this.stored(id);
    this.projects.delete(id);
    return { status: "ok" };
  }
  chapters(id: string) {
    return {
      chapters: [...this.stored(id).chapters.values()].map((c) =>
        this.chapterSummary(c),
      ),
    };
  }
  chapter(project: string, id: string) {
    return structuredClone(this.storedChapter(project, id));
  }
  createChapter(project: string, value: unknown) {
    const p = this.stored(project),
      b = input(value, ["name", "from_url"]);
    if (!text(b.name)) return invalid();
    if (b.from_url != null)
      throw new StudioError(
        400,
        "unsupported_studio_import",
        "Remote chapter imports are not supported",
      );
    let id: string;
    do {
      id = `sim-chapter-created-${this.nextChapterId++}`;
    } while ([...this.projects.values()].some((p) => p.chapters.has(id)));
    const chapter: Chapter = {
      chapter_id: id,
      name: b.name,
      can_be_downloaded: false,
      state: "default",
      content: { blocks: [] },
      statistics: {
        characters_unconverted: 0,
        characters_converted: 0,
        paragraphs_converted: 0,
        paragraphs_unconverted: 0,
      },
      voice_ids: [],
    };
    p.chapters.set(id, chapter);
    return { chapter: this.chapter(project, id) };
  }
  updateChapter(project: string, id: string, value: unknown) {
    const old = this.storedChapter(project, id),
      b = input(value, ["name", "content"]);
    if (b.name != null && !text(b.name)) return invalid();
    const candidate = structuredClone(old);
    if (b.name != null) candidate.name = b.name as string;
    if (b.content != null) {
      const c = input(b.content, ["blocks"]);
      if (!Array.isArray(c.blocks)) return invalid();
      const ids = new Set<string>();
      const blocks = c.blocks.map((value, index) => {
        const block = input(value, ["sub_type", "nodes", "block_id"]);
        if (
          (block.sub_type != null &&
            !["p", "h1", "h2", "h3"].includes(block.sub_type as string)) ||
          (block.block_id != null && !text(block.block_id)) ||
          !Array.isArray(block.nodes)
        )
          return invalid();
        const block_id =
          (block.block_id as string) ?? `${id}-block-${index + 1}`;
        if (ids.has(block_id)) return invalid();
        ids.add(block_id);
        const nodes = block.nodes.map((value) => {
          const n = input(value, ["type", "text", "voice_id"]);
          if (
            n.type !== "tts_node" ||
            typeof n.text !== "string" ||
            !text(n.voice_id)
          )
            return invalid();
          return {
            type: "tts_node" as const,
            text: n.text,
            voice_id: n.voice_id,
            project_voice_ref_id: n.voice_id,
          };
        });
        return { block_id, nodes };
      });
      candidate.content = { blocks };
      candidate.voice_ids = [
        ...new Set(blocks.flatMap((b) => b.nodes.map((n) => n.voice_id))),
      ];
      candidate.statistics = {
        characters_unconverted: blocks.reduce(
          (total, b) =>
            total + b.nodes.reduce((count, n) => count + n.text.length, 0),
          0,
        ),
        characters_converted: 0,
        paragraphs_converted: 0,
        paragraphs_unconverted: blocks.length,
      };
      candidate.can_be_downloaded = false;
      candidate.state = "default";
      candidate.last_conversion_date_unix = null;
      candidate.conversion_progress = null;
      candidate.last_conversion_error = null;
      this.stored(project).metadata.can_be_downloaded = false;
    }
    this.stored(project).chapters.set(id, candidate);
    return { chapter: this.chapter(project, id) };
  }
  deleteChapter(project: string, id: string) {
    this.storedChapter(project, id);
    const p = this.stored(project);
    p.chapters.delete(id);
    p.muted.delete(id);
    return { status: "ok" };
  }
  mutedTracks(id: string) {
    const p = this.stored(id);
    return {
      chapter_ids: [...p.chapters.keys()].filter((id) => p.muted.has(id)),
    };
  }
  attachDictionaries(id: string, value: unknown) {
    const p = this.stored(id),
      b = input(value, [
        "pronunciation_dictionary_locators",
        "invalidate_affected_text",
      ]);
    if (
      !Array.isArray(b.pronunciation_dictionary_locators) ||
      (b.invalidate_affected_text !== undefined &&
        typeof b.invalidate_affected_text !== "boolean")
    )
      return invalid();
    const seen = new Set<string>();
    const versions = b.pronunciation_dictionary_locators.map((value) => {
      const locator = input(value, [
        "pronunciation_dictionary_id",
        "version_id",
      ]);
      if (
        !text(locator.pronunciation_dictionary_id) ||
        (locator.version_id !== null && !text(locator.version_id)) ||
        seen.has(locator.pronunciation_dictionary_id)
      )
        return invalid();
      seen.add(locator.pronunciation_dictionary_id);
      const version = this.dictionaryVersion(
        locator.pronunciation_dictionary_id,
        locator.version_id as string | null,
      );
      if (!version)
        throw new StudioError(
          404,
          "pronunciation_dictionary_version_not_found",
          "Dictionary or version not found",
        );
      return structuredClone(version);
    });
    const locators = versions.map((v) => ({
      pronunciation_dictionary_id: v.pronunciation_dictionary_id,
      version_id: v.version_id,
    }));
    const changed =
      JSON.stringify(locators) !==
      JSON.stringify(p.metadata.pronunciation_dictionary_locators);
    p.metadata.pronunciation_dictionary_versions = versions;
    p.metadata.pronunciation_dictionary_locators = locators;
    if (changed && b.invalidate_affected_text !== false) {
      p.metadata.can_be_downloaded = false;
      for (const c of p.chapters.values()) {
        c.can_be_downloaded = false;
        c.last_conversion_date_unix = null;
        c.conversion_progress = null;
        c.last_conversion_error = null;
      }
    }
    return { status: "ok" };
  }
}
