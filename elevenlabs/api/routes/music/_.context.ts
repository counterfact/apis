import { audioDuration } from "../../support/audio.js";
import { storedZip } from "../../support/zip.js";
import type { MusicPrompt } from "../../types/v1/components/schemas/MusicPrompt.js";
import type { SongMetadata } from "../../types/v1/components/schemas/SongMetadata.js";
import { isDeepStrictEqual } from "node:util";
type RecordValue = {
  input: unknown;
  compositionPlan?: MusicPrompt;
  contentType?: string;
  audio: Uint8Array;
  durationMs: number;
  songId: string;
};
const object = (v: unknown): v is Record<string, unknown> =>
  v !== null && typeof v === "object" && !Array.isArray(v);
export class MusicError extends Error {
  override name = "MusicError";
  constructor(
    public status: number,
    public code: string,
  ) {
    super(code);
  }
}
const fail = (status: number, code: string): never => {
  throw new MusicError(status, code);
};
export class Context {
  songs = new Map<string, RecordValue>();
  plans = new Map<string, { input: unknown; plan: MusicPrompt }>();
  audio = new Uint8Array();
  nextSong = 0;
  nextPlan = 0;
  defaults?: { plan: MusicPrompt; durationMs: number; metadata: SongMetadata };
  modelExists: ((id: string) => boolean) | undefined;
  stemNames: Record<string, string[]> = {};
  private ready() {
    if (!this.defaults || !this.modelExists || !this.audio.length)
      throw new Error("Run startup or reset");
    return this.defaults;
  }
  private options(
    input: unknown,
    query: Record<string, unknown>,
    plan = false,
  ) {
    const d = this.ready();
    const allowed = plan
      ? ["prompt", "music_length_ms", "source_composition_plan", "model_id"]
      : [
          "prompt",
          "generation_mode",
          "music_prompt",
          "lyrics_text",
          "composition_plan",
          "music_length_ms",
          "model_id",
          "seed",
          "force_instrumental",
          "finetune_id",
          "finetune_strength",
          "use_phonetic_names",
          "respect_sections_durations",
          "store_for_inpainting",
          "sign_with_c2pa",
          "with_timestamps",
          "with_waveform_visual",
          "model_style_prefix",
        ];
    if (
      !object(input) ||
      Object.keys(input).some((k) => !allowed.includes(k)) ||
      Object.keys(query).some(
        (k) =>
          !["enable_logging", ...(plan ? [] : ["output_format"])].includes(k),
      ) ||
      (query.enable_logging != null &&
        typeof query.enable_logging !== "boolean")
    )
      return fail(400, "invalid_music_request");
    if (
      (input.model_id != null && input.model_id !== "music_v1") ||
      (input.music_length_ms != null &&
        input.music_length_ms !== d.durationMs) ||
      (query.output_format != null &&
        !["auto", "mp3_44100_128"].includes(String(query.output_format)))
    )
      return fail(400, "unsupported_music_option");
    if (!this.modelExists!("music_v1")) return fail(404, "model_not_found");
    return input;
  }
  plan(input: unknown, query: Record<string, unknown> = {}) {
    const b = this.options(input, query, true),
      d = this.defaults!;
    if (
      typeof b.prompt !== "string" ||
      !b.prompt.trim() ||
      Array.from(b.prompt).length > 2000
    )
      return fail(400, "invalid_music_request");
    if (b.source_composition_plan != null)
      return fail(400, "unsupported_music_option");
    const result = structuredClone(d.plan),
      id = `sim-music-plan-${this.nextPlan + 1}`;
    if (query.enable_logging !== false)
      this.plans.set(id, {
        input: structuredClone(input),
        plan: structuredClone(result),
      });
    this.nextPlan++;
    return result;
  }
  compose(input: unknown, query: Record<string, unknown> = {}) {
    const b = this.options(input, query),
      d = this.defaults!;
    const hasPrompt = b.prompt != null,
      hasPlan = b.composition_plan != null;
    if (
      hasPrompt === hasPlan ||
      (hasPrompt &&
        (typeof b.prompt !== "string" ||
          !b.prompt.trim() ||
          Array.from(b.prompt).length > 2000)) ||
      (hasPlan && !isDeepStrictEqual(b.composition_plan, d.plan))
    )
      return fail(400, "invalid_music_request");
    if (
      ["music_prompt", "lyrics_text", "seed", "finetune_id"].some(
        (k) => b[k] != null,
      ) ||
      (b.generation_mode != null &&
        (b.generation_mode !== "track" || !hasPrompt)) ||
      (b.finetune_strength != null && b.finetune_strength !== 1) ||
      (b.respect_sections_durations != null &&
        b.respect_sections_durations !== true) ||
      (b.model_style_prefix != null && b.model_style_prefix !== "music") ||
      [
        "force_instrumental",
        "use_phonetic_names",
        "store_for_inpainting",
        "sign_with_c2pa",
        "with_timestamps",
        "with_waveform_visual",
      ].some((k) => b[k] != null && b[k] !== false) ||
      (hasPlan && b.music_length_ms != null)
    )
      return fail(400, "unsupported_music_option");
    const songId = `sim-music-song-${this.nextSong + 1}`,
      record = {
        songId,
        input: structuredClone(input),
        compositionPlan: structuredClone(d.plan),
        audio: new Uint8Array(this.audio),
        durationMs: d.durationMs,
      };
    if (query.enable_logging !== false)
      this.songs.set(songId, structuredClone(record));
    this.nextSong++;
    return record;
  }
  validateAudio(input: unknown) {
    if (!object(input) || !(input.data instanceof Uint8Array) ||
        typeof input.filename !== "string" || !input.filename.trim() || input.filename.length > 255 ||
        typeof input.contentType !== "string" || input.size !== input.data.length ||
        input.data.length === 0 || input.data.length > 8 * 1024 * 1024)
      return fail(400, "invalid_music_file");
    const duration = audioDuration(input.data, input.contentType);
    if (duration === undefined || duration > 600) return fail(400, "invalid_music_file");
    return { audio: new Uint8Array(input.data), contentType: input.contentType, durationMs: duration * 1000 };
  }
  private processingOptions(query: Record<string, unknown>) {
    if (Object.keys(query).some(k => !["output_format", "enable_logging"].includes(k)) ||
        (query.enable_logging != null && typeof query.enable_logging !== "boolean"))
      return fail(400, "invalid_music_request");
    if (query.output_format != null && query.output_format !== "mp3_44100_128")
      return fail(400, "unsupported_music_option");
  }
  upload(input: unknown) {
    this.ready();
    if (!object(input) || Object.keys(input).some(k => !["file", "extract_composition_plan", "with_timestamps", "with_waveform_visual"].includes(k)))
      return fail(400, "invalid_music_request");
    if (["extract_composition_plan", "with_timestamps", "with_waveform_visual"].some(k => input[k] != null && input[k] !== false))
      return fail(400, "unsupported_music_option");
    const source = this.validateAudio(input.file);
    if (!this.modelExists!("music_v1")) return fail(404, "model_not_found");
    const songId = `sim-music-song-${this.nextSong + 1}`;
    this.songs.set(songId, { songId, ...source, input: structuredClone(input) });
    this.nextSong++;
    return { song_id: songId };
  }
  separateStems(input: unknown, query: Record<string, unknown> = {}) {
    this.ready(); this.processingOptions(query);
    if (!object(input) || Object.keys(input).some(k => !["file", "stem_variation_id", "sign_with_c2pa"].includes(k)))
      return fail(400, "invalid_music_request");
    if (input.sign_with_c2pa != null && input.sign_with_c2pa !== false) return fail(400, "unsupported_music_option");
    this.validateAudio(input.file);
    const variation = input.stem_variation_id ?? "six_stems_v1";
    if (typeof variation !== "string" || !["two_stems_v1", "six_stems_v1"].includes(variation))
      return fail(400, "invalid_music_request");
    const names = this.stemNames[variation];
    if (!names?.length) throw new Error("Run startup or reset");
    // Synthetic silence tracks; input is validated but is never separated.
    return storedZip(names.map(name => ({ name: `${name}.mp3`, data: this.audio })));
  }
  videoToMusic(input: unknown, query: Record<string, unknown> = {}) {
    this.ready(); this.processingOptions(query);
    if (!object(input) || Object.keys(input).some(k => !["videos", "description", "tags", "model_id", "add_sfx", "separate_tracks", "use_audio_as_reference", "sign_with_c2pa"].includes(k)) ||
        !Array.isArray(input.videos) || input.videos.length < 1 || input.videos.length > 10 ||
        (input.description != null && (typeof input.description !== "string" || Array.from(input.description).length > 4100)) ||
        (input.tags != null && (!Array.isArray(input.tags) || input.tags.length > 10 || input.tags.some(t => typeof t !== "string" || !t.trim()))))
      return fail(400, "invalid_music_request");
    let size = 0;
    for (const video of input.videos) {
      if (!object(video) || !(video.data instanceof Uint8Array) || video.contentType !== "video/mp4" ||
          typeof video.filename !== "string" || !video.filename.trim() || video.filename.length > 255 ||
          video.size !== video.data.length || !video.data.length || video.data.length > 8 * 1024 * 1024)
        return fail(400, "invalid_video_file");
      size += video.data.length;
    }
    if (size > 16 * 1024 * 1024) return fail(400, "video_size_exceeded");
    if ((input.model_id != null && input.model_id !== "music_v1") ||
        ["add_sfx", "separate_tracks", "use_audio_as_reference", "sign_with_c2pa"].some(k => input[k] != null && input[k] !== false))
      return fail(400, "unsupported_music_option");
    // Opaque video input: no decoding, duration measurement or visual analysis.
    const song = this.compose({ prompt: "Synthetic video soundtrack" }, query);
    if (query.enable_logging !== false) this.songs.get(song.songId)!.input = structuredClone(input);
    return song;
  }
  detailed(song: RecordValue) {
    const boundary = `counterfact-${song.songId}`,
      metadata = {
        composition_plan: song.compositionPlan,
        song_metadata: structuredClone(this.defaults!.metadata),
      };
    const body = Buffer.concat([
      Buffer.from(
        `--${boundary}\r\nContent-Type: application/json\r\n\r\n${JSON.stringify(metadata)}\r\n--${boundary}\r\nContent-Type: audio/mpeg\r\nContent-Disposition: attachment; filename="${song.songId}.mp3"\r\n\r\n`,
      ),
      Buffer.from(song.audio),
      Buffer.from(`\r\n--${boundary}--\r\n`),
    ]);
    return { contentType: `multipart/mixed; boundary=${boundary}`, body };
  }
  events(song: RecordValue) {
    const events: [string, unknown][] = [
      ["composition_plan", song.compositionPlan],
      ["song_metadata", structuredClone(this.defaults!.metadata)],
      [
        "audio_chunk",
        {
          audio_base64: Buffer.from(song.audio).toString("base64"),
          words_timestamps: [],
          waveform_visual: [],
        },
      ],
      ["done", { song_id: song.songId }],
    ];
    return events
      .map(
        ([name, data]) => `event: ${name}\ndata: ${JSON.stringify(data)}\n\n`,
      )
      .join("");
  }
}
