import type { ProjectExtendedResponseModel as Project } from "../../../types/v1/components/schemas/ProjectExtendedResponseModel.js";
import type { ProjectResponseModel as Summary } from "../../../types/v1/components/schemas/ProjectResponseModel.js";
import type { ChapterWithContentResponseModel as Chapter } from "../../../types/v1/components/schemas/ChapterWithContentResponseModel.js";
import type { ChapterResponseModel as ChapterSummary } from "../../../types/v1/components/schemas/ChapterResponseModel.js";
import type { PronunciationDictionaryVersionResponseModel as Version } from "../../../types/v1/components/schemas/PronunciationDictionaryVersionResponseModel.js";
import type { ProjectSnapshotExtendedResponseModel as ProjectSnapshot } from "../../../types/v1/components/schemas/ProjectSnapshotExtendedResponseModel.js";
import type { ChapterSnapshotExtendedResponseModel as ChapterSnapshot } from "../../../types/v1/components/schemas/ChapterSnapshotExtendedResponseModel.js";
import { crc32 } from "node:zlib";
import { SaxesParser } from "saxes";
import { copyUpload } from "../../assets/_.context.js";
export type StudioSnapshot = {
  projectwide: boolean;
  metadata: ProjectSnapshot;
  audio: Uint8Array;
  chapters: Array<{ metadata: ChapterSnapshot; audio: Uint8Array }>;
};
export type StudioConversion = { project: StoredProject; chapter?: string };
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
  snapshots = new Map<string, StudioSnapshot>();
  pending = new Map<string, StudioConversion>();
  nextSnapshot = 1;
  nextProject = 1;
  audio = new Uint8Array();
  time = 0;
  duration = 0;
  voiceExists: (id: string) => boolean = () => false;
  modelExists: (id: string) => boolean = () => false;
  podcastTemplate: StoredProject | undefined;
  creationTemplate: StoredProject["metadata"] | undefined;
  documentLimits:
    | {
        maxBytes: number;
        maxName: number;
        maxCharacters: number;
        maxChapters: number;
        maxDepth: number;
      }
    | undefined;
  /** Decode a bounded local document. No remote lookup, OCR or office/PDF parsing. */
  documentText(value: unknown, audioNative = false) {
    const limits = this.documentLimits;
    if (!limits) throw new Error("Run Studio initialization scenario first");
    let file;
    try {
      file = copyUpload(value, limits.maxBytes, limits.maxName);
    } catch {
      return invalid();
    }
    const plain =
      /\.(txt|md|markdown)$/i.test(file.filename) &&
      ["text/plain", "text/markdown", "application/octet-stream"].includes(
        file.contentType,
      );
    const html =
      /\.(html|htm|xhtml)$/i.test(file.filename) &&
      [
        "text/html",
        "application/xhtml+xml",
        "application/octet-stream",
      ].includes(file.contentType);
    if (
      (!plain && !html) ||
      (audioNative && plain && !/\.txt$/i.test(file.filename))
    )
      throw new StudioError(
        400,
        "unsupported_studio_document",
        "Only UTF-8 text, Markdown and a bounded well-formed HTML subset are supported; AudioNative accepts TXT or HTML",
      );
    let source: string;
    try {
      source = new TextDecoder("utf-8", { fatal: true }).decode(file.data);
    } catch {
      return invalid();
    }
    if (/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(source))
      return invalid();
    if (html) {
      let depth = 0,
        result = "";
      const parser = new SaxesParser();
      parser.on("error", () => invalid());
      parser.on("doctype", () => invalid());
      parser.on("processinginstruction", () => invalid());
      parser.on("xmldecl", (decl) => {
        if (decl.encoding && !/^utf-8$/i.test(decl.encoding)) return invalid();
      });
      parser.on("cdata", () => invalid());
      parser.on("opentag", (tag) => {
        if (
          ++depth > limits.maxDepth ||
          ![
            "html",
            "body",
            "div",
            "p",
            "h1",
            "h2",
            "h3",
            "h4",
            "h5",
            "h6",
            "span",
            "strong",
            "em",
            "b",
            "i",
            "br",
          ].includes(tag.name) ||
          Object.keys(tag.attributes).length
        )
          return invalid();
        if (tag.name === "br") result += "\n";
      });
      parser.on("text", (text) => {
        result += text;
      });
      parser.on("closetag", (tag) => {
        depth--;
        if (["p", "div", "h1", "h2", "h3", "h4", "h5", "h6"].includes(tag.name))
          result += "\n";
      });
      try {
        parser.write(source).close();
      } catch {
        return invalid();
      }
      source = result
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean)
        .join("\n");
    }
    if (!source.trim() || source.length > limits.maxCharacters)
      return invalid();
    return source;
  }
  private validationContext() {
    const c = new Context();
    c.voiceExists = this.voiceExists;
    c.modelExists = this.modelExists;
    c.dictionaryVersion = this.dictionaryVersion;
    c.nextChapterId = this.nextChapterId;
    c.documentLimits = this.documentLimits;
    return c;
  }
  /** Build and validate a detached project before publishing any state or counters. */
  createProject(value: unknown) {
    const b = input(value, [
      "name",
      "default_title_voice_id",
      "default_paragraph_voice_id",
      "default_model_id",
      "from_url",
      "from_document",
      "from_content_json",
      "quality_preset",
      "title",
      "author",
      "description",
      "genres",
      "target_audience",
      "language",
      "content_type",
      "original_publication_date",
      "mature_content",
      "isbn_number",
      "acx_volume_normalization",
      "volume_normalization",
      "pronunciation_dictionary_locators",
      "callback_url",
      "fiction",
      "apply_text_normalization",
      "auto_convert",
      "auto_assign_voices",
      "source_type",
      "voice_settings",
      "create_publishing_read",
    ]);
    const template = this.creationTemplate,
      limits = this.documentLimits;
    if (!template || !limits)
      throw new Error("Run Studio initialization scenario first");
    if (
      !text(b.name) ||
      b.name.length > limits.maxName ||
      [
        "auto_convert",
        "auto_assign_voices",
        "create_publishing_read",
        "mature_content",
        "acx_volume_normalization",
        "volume_normalization",
      ].some((k) => b[k] != null && typeof b[k] !== "boolean")
    )
      return invalid();
    if (
      b.from_url != null ||
      b.callback_url != null ||
      b.auto_assign_voices === true ||
      b.create_publishing_read === true ||
      (b.voice_settings != null &&
        (!Array.isArray(b.voice_settings) || b.voice_settings.length)) ||
      (b.quality_preset != null && b.quality_preset !== "standard") ||
      (b.apply_text_normalization != null &&
        b.apply_text_normalization !== "auto") ||
      b.acx_volume_normalization === true ||
      b.volume_normalization === true
    )
      return invalid();
    if (
      Number(b.from_document != null) + Number(b.from_content_json != null) >
      1
    )
      return invalid();
    for (const k of [
      "title",
      "author",
      "description",
      "language",
      "content_type",
      "original_publication_date",
      "isbn_number",
    ])
      if (
        b[k] != null &&
        (typeof b[k] !== "string" || b[k].length > limits.maxCharacters)
      )
        return invalid();
    if (
      b.genres != null &&
      (!Array.isArray(b.genres) ||
        b.genres.length > 20 ||
        b.genres.some((v) => !text(v)))
    )
      return invalid();
    if (
      (b.target_audience != null &&
        !["children", "young adult", "adult", "all ages"].includes(
          b.target_audience as string,
        )) ||
      (b.fiction != null &&
        !["fiction", "non-fiction"].includes(b.fiction as string)) ||
      (b.source_type != null &&
        !["blank", "book", "article"].includes(b.source_type as string))
    )
      return invalid();
    const m = structuredClone(template);
    let sequence = this.nextProject,
      id: string;
    do {
      id = `sim-project-created-${sequence++}`;
    } while (this.projects.has(id));
    m.project_id = id;
    m.name = b.name;
    m.create_date_unix = this.time;
    for (const key of [
      "default_title_voice_id",
      "default_paragraph_voice_id",
      "default_model_id",
    ]) {
      if (b[key] != null) {
        if (!text(b[key])) return invalid();
        Object.assign(m, { [key]: b[key] });
      }
    }
    m.default_title_voice_ref_id = m.default_title_voice_id;
    m.default_paragraph_voice_ref_id = m.default_paragraph_voice_id;
    if (
      !this.voiceExists(m.default_title_voice_id) ||
      !this.voiceExists(m.default_paragraph_voice_id) ||
      !this.modelExists(m.default_model_id)
    )
      throw new StudioError(
        404,
        "studio_dependency_not_found",
        "Voice or speech model not found",
      );
    for (const key of [
      "title",
      "author",
      "description",
      "genres",
      "target_audience",
      "language",
      "content_type",
      "original_publication_date",
      "mature_content",
      "isbn_number",
      "fiction",
      "source_type",
    ])
      if (b[key] !== undefined)
        Object.assign(m, { [key]: structuredClone(b[key]) });
    const c = this.validationContext(),
      p: StoredProject = { metadata: m, chapters: new Map(), muted: new Set() };
    c.projects.set(id, p);
    c.populateContent(id, b);
    if (b.pronunciation_dictionary_locators != null) {
      if (!Array.isArray(b.pronunciation_dictionary_locators)) return invalid();
      let locators;
      try {
        locators = b.pronunciation_dictionary_locators.map((v) =>
          JSON.parse(v),
        );
      } catch {
        return invalid();
      }
      c.attachDictionaries(id, { pronunciation_dictionary_locators: locators });
    }
    if (b.auto_convert === true) c.convert(id);
    this.projects.set(id, p);
    if (c.pending.has(id)) this.pending.set(id, c.pending.get(id)!);
    this.nextProject = sequence;
    this.nextChapterId = c.nextChapterId;
    return { project: this.projectSummary(p) };
  }
  /** Called only on detached candidates, so rejected imports cannot change live state. */
  private populateContent(id: string, b: Obj) {
    const p = this.stored(id),
      m = p.metadata,
      limits = this.documentLimits;
    if (!limits) throw new Error("Run Studio initialization scenario first");
    if (b.from_document == null && b.from_content_json == null) return;
    if (
      !this.voiceExists(m.default_title_voice_id) ||
      !this.voiceExists(m.default_paragraph_voice_id) ||
      !this.modelExists(m.default_model_id)
    )
      throw new StudioError(
        404,
        "studio_dependency_not_found",
        "Voice or speech model not found",
      );
    let chapters: unknown;
    if (b.from_document != null)
      chapters = [
        {
          name: m.title || m.name,
          blocks: [
            {
              nodes: [
                {
                  type: "tts_node",
                  text: this.documentText(b.from_document),
                  voice_id: m.default_paragraph_voice_id,
                },
              ],
            },
          ],
        },
      ];
    else if (b.from_content_json != null) {
      if (
        typeof b.from_content_json !== "string" ||
        b.from_content_json.length > limits.maxBytes
      )
        return invalid();
      try {
        chapters = JSON.parse(b.from_content_json);
      } catch {
        return invalid();
      }
    }
    if (chapters !== undefined) {
      if (
        !Array.isArray(chapters) ||
        !chapters.length ||
        chapters.length > limits.maxChapters
      )
        return invalid();
      for (const value of chapters) {
        const ch = input(value, ["name", "blocks"]),
          created = this.createChapter(id, { name: ch.name }).chapter;
        this.updateChapter(id, created.chapter_id, {
          content: { blocks: ch.blocks },
        });
        const stored = p.chapters.get(created.chapter_id)!;
        if (
          (stored.statistics?.characters_unconverted ?? 0) >
          limits.maxCharacters
        )
          return invalid();
        if ((stored.voice_ids ?? []).some((voice) => !this.voiceExists(voice)))
          throw new StudioError(
            404,
            "studio_dependency_not_found",
            "Voice or speech model not found",
          );
      }
    }
  }
  replaceDocumentText(id: string, text: string, autoConvert: boolean) {
    const p = this.stored(id);
    if (
      typeof text !== "string" ||
      !text.trim() ||
      text.length > (this.documentLimits?.maxCharacters ?? 0)
    )
      return invalid();
    return this.updateContent(id, {
      auto_convert: autoConvert,
      from_content_json: JSON.stringify([
        {
          name: p.metadata.title || p.metadata.name,
          blocks: [
            {
              nodes: [
                {
                  type: "tts_node",
                  text,
                  voice_id: p.metadata.default_paragraph_voice_id,
                },
              ],
            },
          ],
        },
      ]),
    });
  }
  private idle(id: string) {
    if (this.pending.has(id))
      throw new StudioError(
        409,
        "studio_conversion_pending",
        "Conversion already pending",
      );
  }
  convert(id: string, chapter?: string) {
    const p = this.stored(id);
    this.idle(id);
    const chapters = chapter
      ? [this.storedChapter(id, chapter)]
      : [...p.chapters.values()];
    if (
      chapters.length > 100 ||
      chapters.some(
        (c) =>
          c.content.blocks
            .flatMap((b) =>
              b.nodes.map((n) => (n.type === "tts_node" ? n.text : "")),
            )
            .join("").length > 2000,
      )
    )
      return invalid();
    if (
      !chapters.length ||
      !chapters.some((c) =>
        c.content.blocks.some((b) =>
          b.nodes.some((n) => n.type === "tts_node" && n.text.trim()),
        ),
      )
    )
      return invalid();
    if (
      !this.modelExists(p.metadata.default_model_id) ||
      chapters.some((c) =>
        c.content.blocks.some((b) =>
          b.nodes.some(
            (n) => n.type === "tts_node" && !this.voiceExists(n.voice_id),
          ),
        ),
      )
    )
      throw new StudioError(
        404,
        "studio_dependency_not_found",
        "Voice or speech model not found",
      );
    if (
      p.metadata.quality_preset !== "standard" ||
      p.metadata.volume_normalization ||
      p.metadata.quality_check_on ||
      p.metadata.quality_check_on_when_bulk_convert ||
      p.metadata.apply_text_normalization !== "auto"
    )
      throw new StudioError(
        400,
        "unsupported_studio_quality",
        "Only standard MP3 fixture quality is supported",
      );
    this.pending.set(id, { project: structuredClone(p), chapter });
    p.metadata.state = "converting";
    for (const c of chapters) c.state = "converting";
    return { status: "ok" };
  }
  listSnapshots(id: string): {
    snapshots: Array<{
      project_snapshot_id: string;
      project_id: string;
      created_at_unix: number;
      name: string;
    }>;
  };
  listSnapshots(
    id: string,
    chapter: string,
  ): {
    snapshots: Array<{
      chapter_snapshot_id: string;
      project_id: string;
      chapter_id: string;
      created_at_unix: number;
      name: string;
    }>;
  };
  listSnapshots(id: string, chapter?: string) {
    const p = this.stored(id);
    if (
      chapter &&
      !p.chapters.has(chapter) &&
      ![...this.snapshots.values()].some(
        (s) =>
          s.metadata.project_id === id &&
          s.chapters.some((c) => c.metadata.chapter_id === chapter),
      )
    )
      this.storedChapter(id, chapter);
    const selected = [...this.snapshots.values()].filter(
      (s) => s.metadata.project_id === id,
    );
    if (chapter)
      return {
        snapshots: selected.flatMap((s) =>
          s.chapters
            .filter((c) => c.metadata.chapter_id === chapter)
            .map((c) => {
              const { character_alignments, ...m } = c.metadata;
              return structuredClone(m);
            }),
        ),
      };
    return {
      snapshots: selected
        .filter((s) => s.projectwide)
        .map((s) => ({
          project_snapshot_id: s.metadata.project_snapshot_id,
          project_id: id,
          created_at_unix: s.metadata.created_at_unix,
          name: s.metadata.name,
        })),
    };
  }

  snapshot(id: string, snapshot: string): ProjectSnapshot;
  snapshot(id: string, snapshot: string, chapter: string): ChapterSnapshot;
  snapshot(
    id: string,
    snapshot: string,
    chapter?: string,
  ): ProjectSnapshot | ChapterSnapshot {
    return structuredClone(this.retained(id, snapshot, chapter).metadata);
  }
  private retained(id: string, snapshot: string, chapter?: string) {
    this.stored(id);
    for (const s of this.snapshots.values())
      if (s.metadata.project_id === id) {
        if (
          !chapter &&
          s.projectwide &&
          s.metadata.project_snapshot_id === snapshot
        )
          return s;
        if (chapter) {
          const c = s.chapters.find(
            (c) =>
              c.metadata.chapter_id === chapter &&
              c.metadata.chapter_snapshot_id === snapshot,
          );
          if (c) return c;
        }
      }
    throw new StudioError(
      404,
      "studio_snapshot_not_found",
      "Snapshot not found",
    );
  }
  snapshotAudio(
    id: string,
    snapshot: string,
    value: unknown,
    chapter?: string,
  ) {
    const b = input(value === undefined ? {} : value, ["convert_to_mpeg"]);
    if (
      b.convert_to_mpeg !== undefined &&
      typeof b.convert_to_mpeg !== "boolean"
    )
      return invalid();
    return new Uint8Array(this.retained(id, snapshot, chapter).audio);
  }
  archive(id: string, snapshot: string) {
    const s = this.retained(id, snapshot) as StudioSnapshot;
    const files: Buffer[] = [],
      directory: Buffer[] = [];
    let offset = 0;
    for (const c of s.chapters) {
      const name = Buffer.from(
          encodeURIComponent(c.metadata.chapter_id) + ".mp3",
        ),
        audio = Buffer.from(c.audio),
        sum = crc32(audio),
        local = Buffer.alloc(30),
        central = Buffer.alloc(46);
      local.writeUInt32LE(0x04034b50);
      local.writeUInt16LE(20, 4);
      local.writeUInt16LE(0x21, 12);
      local.writeUInt32LE(sum, 14);
      local.writeUInt32LE(audio.length, 18);
      local.writeUInt32LE(audio.length, 22);
      local.writeUInt16LE(name.length, 26);
      central.writeUInt32LE(0x02014b50);
      central.writeUInt16LE(20, 4);
      central.writeUInt16LE(20, 6);
      central.writeUInt16LE(0x21, 14);
      central.writeUInt32LE(sum, 16);
      central.writeUInt32LE(audio.length, 20);
      central.writeUInt32LE(audio.length, 24);
      central.writeUInt16LE(name.length, 28);
      central.writeUInt32LE(offset, 42);
      files.push(local, name, audio);
      directory.push(central, name);
      offset += local.length + name.length + audio.length;
    }
    const d = Buffer.concat(directory),
      end = Buffer.alloc(22);
    end.writeUInt32LE(0x06054b50);
    end.writeUInt16LE(s.chapters.length, 8);
    end.writeUInt16LE(s.chapters.length, 10);
    end.writeUInt32LE(d.length, 12);
    end.writeUInt32LE(offset, 16);
    return new Uint8Array(Buffer.concat([...files, d, end]));
  }
  updateContent(id: string, value: unknown) {
    const live = this.stored(id);
    this.idle(id);
    const b = input(value === undefined ? {} : value, [
      "from_url",
      "from_document",
      "from_content_json",
      "auto_convert",
    ]);
    if (b.from_url != null)
      throw new StudioError(
        400,
        "unsupported_studio_import",
        "Remote project imports are not supported",
      );
    if (
      Number(b.from_document != null) + Number(b.from_content_json != null) >
        1 ||
      (b.auto_convert !== undefined && typeof b.auto_convert !== "boolean")
    )
      return invalid();
    const c = this.validationContext(),
      p = structuredClone(live);
    p.chapters = new Map();
    p.muted = new Set();
    p.metadata.can_be_downloaded = false;
    p.metadata.state = "default";
    c.projects.set(id, p);
    c.populateContent(id, b);
    if (b.auto_convert === true) c.convert(id);
    this.projects.set(id, p);
    this.nextChapterId = c.nextChapterId;
    if (c.pending.has(id)) this.pending.set(id, c.pending.get(id)!);
    return { project: this.projectSummary(p) };
  }
  podcast(value: unknown) {
    const b = input(value, [
      "model_id",
      "mode",
      "source",
      "quality_preset",
      "duration_scale",
      "language",
      "intro",
      "outro",
      "instructions_prompt",
      "highlights",
      "callback_url",
      "apply_text_normalization",
    ]);
    if (
      !object(b.mode) ||
      b.mode.type !== "bulletin" ||
      !object(b.mode.bulletin) ||
      !text(b.mode.bulletin.host_voice_id) ||
      Object.keys(b.mode).some((k) => !["type", "bulletin"].includes(k)) ||
      Object.keys(b.mode.bulletin).some((k) => k !== "host_voice_id") ||
      !object(b.source) ||
      b.source.type !== "text" ||
      !text(b.source.text) ||
      Object.keys(b.source).some((k) => !["type", "text"].includes(k)) ||
      b.source.text.length > 2000 ||
      !text(b.model_id)
    )
      return invalid();
    if (
      (b.quality_preset != null && b.quality_preset !== "standard") ||
      (b.duration_scale !== undefined && b.duration_scale !== "default") ||
      (b.apply_text_normalization != null &&
        b.apply_text_normalization !== "auto") ||
      [
        "language",
        "intro",
        "outro",
        "instructions_prompt",
        "highlights",
        "callback_url",
      ].some((k) => b[k] != null)
    )
      return invalid();
    if (
      !this.voiceExists(b.mode.bulletin.host_voice_id) ||
      !this.modelExists(b.model_id)
    )
      throw new StudioError(
        404,
        "studio_dependency_not_found",
        "Voice or speech model not found",
      );
    if (!this.podcastTemplate) return invalid();
    const p = structuredClone(this.podcastTemplate),
      id = `sim-podcast-${this.nextProject++}`;
    p.metadata.project_id = id;
    p.metadata.name = "Synthetic bulletin";
    p.metadata.default_model_id = b.model_id;
    p.metadata.source_type = "blank";
    p.metadata.default_title_voice_id = b.mode.bulletin.host_voice_id;
    p.metadata.default_title_voice_ref_id = b.mode.bulletin.host_voice_id;
    p.metadata.default_paragraph_voice_id = b.mode.bulletin.host_voice_id;
    p.metadata.default_paragraph_voice_ref_id = b.mode.bulletin.host_voice_id;
    p.chapters = new Map();
    p.muted = new Set();
    this.projects.set(id, p);
    const ch = this.createChapter(id, { name: "Source text" }).chapter;
    this.updateChapter(id, ch.chapter_id, {
      content: {
        blocks: [
          {
            nodes: [
              {
                type: "tts_node",
                text: b.source.text,
                voice_id: b.mode.bulletin.host_voice_id,
              },
            ],
          },
        ],
      },
    });
    this.convert(id);
    return { project: this.projectSummary(p) };
  }
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
    this.idle(id);
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
    this.pending.delete(id);
    for (const [key, s] of this.snapshots)
      if (s.metadata.project_id === id) this.snapshots.delete(key);
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
    this.idle(project);
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
    this.idle(project);
    const old = this.storedChapter(project, id),
      b = input(value === undefined ? {} : value, ["name", "content"]);
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
    this.idle(project);
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
    this.idle(id);
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
