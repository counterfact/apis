import { Context as StudioContext, StudioError } from "../studio/projects/_.context.js";
import type { AudioNativeProjectSettingsResponseModel as Settings } from "../../types/v1/components/schemas/AudioNativeProjectSettingsResponseModel.js";
import type { GetAudioNativeProjectSettingsResponseModel as Response } from "../../types/v1/components/schemas/GetAudioNativeProjectSettingsResponseModel.js";
import type { ChapterWithContentResponseModel as Chapter } from "../../types/v1/components/schemas/ChapterWithContentResponseModel.js";
export type Player = { defaults: Settings; snapshot: string | null };
export type Article = { project: string; text: string };
export type Publication = { title: string; author: string; previousSnapshots: string[] };
const invalid = (): never => { throw new StudioError(400,"invalid_audio_native_request","Invalid local AudioNative request"); };
export class Context {
  players = new Map<string, Player>();
  articles = new Map<string, Article>();
  pending = new Map<string, Publication>();
  studio: () => StudioContext = () => { throw new Error("AudioNative scenario not initialized"); };
  settings(id: string): Response {
    const studio = this.studio(), project = studio.get(id), player = this.players.get(id);
    if (!player) return {enabled:false, snapshot_id:null, settings:null};
    return {enabled:true, snapshot_id:player.snapshot, settings: structuredClone({
      ...player.defaults, title: project.title ?? player.defaults.title,
      author: project.author ?? player.defaults.author,
      status: studio.pending.has(id) || this.pending.has(id) ? "processing" : "ready",
      audio_path:null, audio_url:null,
    })};
  }
  update(value: unknown) {
    if (!value || typeof value !== "object" || Array.isArray(value)) return invalid();
    const b = value as Record<string, unknown>;
    if (Object.keys(b).some(k => !["url","title","author"].includes(k)) || typeof b.url !== "string" || !b.url.trim() ||
        ["title","author"].some(k => b[k] != null && typeof b[k] !== "string")) return invalid();
    const article = this.articles.get(b.url);
    if (!article) return invalid();
    const c = this.studio(), id = article.project, live = c.projects.get(id);
    c.get(id);
    const player = this.players.get(id);
    if (!player) throw new StudioError(404,"audio_native_player_not_found","AudioNative player not found");
    if (c.pending.has(id) || this.pending.has(id)) throw new StudioError(409,"studio_conversion_pending","Conversion or publishing already pending");
    const title = (b.title ?? player.defaults.title) as string, author = (b.author ?? player.defaults.author) as string;
    const text = [title, author, article.text].join("\n");
    // Validate the entire candidate using canonical Studio rules before replacing live state.
    const candidate = structuredClone(live!);
    const chapter: Chapter = { chapter_id: "sim-audio-native-chapter", name: title,
      state: "default", can_be_downloaded: false,
      voice_ids: [], content: {blocks: []},
      statistics: {characters_unconverted: 0, characters_converted: 0, paragraphs_unconverted: 0, paragraphs_converted: 0},
      last_conversion_date_unix: null, conversion_progress: null, last_conversion_error: null,
    };
    if (!article.text.trim() || text.length > 2000) return invalid();
    const voice = candidate.metadata.default_paragraph_voice_id;
    chapter.voice_ids = [voice];
    chapter.content = {blocks:[{block_id:"sim-audio-native-block",nodes:[{type:"tts_node",text,voice_id:voice,project_voice_ref_id:voice}]}]};
    chapter.statistics = {characters_unconverted:text.length,characters_converted:0,paragraphs_unconverted:1,paragraphs_converted:0};
    candidate.chapters = new Map([[chapter.chapter_id,chapter]]); candidate.muted = new Set();
    candidate.metadata.title = title; candidate.metadata.author = author; candidate.metadata.can_be_downloaded = false;
    const check = new StudioContext();
    check.projects.set(id,candidate); check.modelExists = c.modelExists; check.voiceExists = c.voiceExists;
    check.convert(id);
    const capture = {title,author,previousSnapshots: c.listSnapshots(id).snapshots.map(s => s.project_snapshot_id)};
    c.projects.set(id,candidate); c.pending.set(id,check.pending.get(id)!);
    this.pending.set(id,structuredClone(capture));
    return {project_id:id,converting:true,publishing:true,html_snippet:"<div id='audio-native-player'></div>"};
  }
}
