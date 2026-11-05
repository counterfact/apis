import { Context as StudioContext, StudioError } from "../studio/projects/_.context.js";
import type { AudioNativeProjectSettingsResponseModel as Settings } from "../../types/v1/components/schemas/AudioNativeProjectSettingsResponseModel.js";
import type { GetAudioNativeProjectSettingsResponseModel as Response } from "../../types/v1/components/schemas/GetAudioNativeProjectSettingsResponseModel.js";
import type { ChapterWithContentResponseModel as Chapter } from "../../types/v1/components/schemas/ChapterWithContentResponseModel.js";
export type Player = { defaults: Settings; snapshot: string | null };
export type Article = { project: string; text: string };
export type Publication = { title: string; author: string; previousSnapshots: string[] };
const invalid = (): never => { throw new StudioError(400,"invalid_audio_native_request","Invalid local AudioNative request"); };
export class Context {
  playerDefaults: Settings | undefined;
  createProject(value: unknown) {
    const b = this.uploadInput(value,["name","image","author","title","small","text_color","background_color","sessionization","voice_id","model_id","file","auto_convert","apply_text_normalization","pronunciation_dictionary_locators"]);
    const defaults = this.playerDefaults;
    if (!defaults) throw new Error("Run AudioNative initialization scenario first");
    for (const key of ["image","title","author","text_color","background_color","voice_id","model_id"])
      if (b[key] != null && (typeof b[key] !== "string" || b[key].length > 2000)) return invalid();
    if (b.small != null && typeof b.small !== "boolean" || b.sessionization != null && (typeof b.sessionization !== "number" || !Number.isInteger(b.sessionization) || b.sessionization < 0 || b.sessionization > 1440)) return invalid();
    const settings = structuredClone(defaults);
    for (const key of ["image","title","author","small","text_color","background_color","sessionization"]) if (b[key] != null) Object.assign(settings,{[key]:b[key]});
    const studio = this.studio();
    const text = b.file == null ? undefined : [settings.title,settings.author,studio.documentText(b.file,true)].join("\n");
    const voice = b.voice_id ?? studio.creationTemplate?.default_paragraph_voice_id;
    const created = studio.createProject({name:b.name, title:settings.title,author:settings.author,
      default_title_voice_id:voice,default_paragraph_voice_id:voice,default_model_id:b.model_id,
      source_type:"article",auto_convert:b.auto_convert,apply_text_normalization:b.apply_text_normalization,
      pronunciation_dictionary_locators:b.pronunciation_dictionary_locators,
      ...(text === undefined ? {} : {from_content_json:JSON.stringify([{name:settings.title || b.name,blocks:[{nodes:[{type:"tts_node",text,voice_id:voice}]}]}])}),
    });
    const id = created.project.project_id;
    this.players.set(id,{defaults:settings,snapshot:null});
    return {project_id:id,converting:b.auto_convert === true,html_snippet:"<div id='audio-native-player'></div>"};
  }
  private uploadInput(value: unknown, allowed: string[]) {
    if (!value || typeof value !== "object" || Array.isArray(value)) return invalid();
    const b = value as Record<string,unknown>;
    if (Object.keys(b).some(k => !allowed.includes(k)) || ["auto_convert","auto_publish"].some(k => b[k] !== undefined && typeof b[k] !== "boolean")) return invalid();
    return b;
  }
  replaceContent(id: string, value: unknown) {
    const studio = this.studio(), project = studio.get(id), player = this.players.get(id);
    if (!player) throw new StudioError(404,"audio_native_player_not_found","AudioNative player not found");
    if (studio.pending.has(id) || this.pending.has(id)) throw new StudioError(409,"studio_conversion_pending","Conversion or publishing already pending");
    const b = this.uploadInput(value,["file","auto_convert","auto_publish"]);
    if (b.file == null || b.auto_publish === true && b.auto_convert !== true) return invalid();
    const title = project.title ?? player.defaults.title, author = project.author ?? player.defaults.author;
    const text = [title,author,studio.documentText(b.file,true)].join("\n");
    const previousSnapshots = studio.listSnapshots(id).snapshots.map(s => s.project_snapshot_id);
    studio.replaceDocumentText(id,text,b.auto_convert === true);
    if (b.auto_publish === true) this.pending.set(id,{title,author,previousSnapshots});
    return {project_id:id,converting:b.auto_convert === true,publishing:b.auto_publish === true,html_snippet:"<div id='audio-native-player'></div>"};
  }
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
