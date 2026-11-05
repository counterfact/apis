import type { DubbingResource } from "../../../types/v1/components/schemas/DubbingResource.js";
import type { DubbedSegment } from "../../../types/v1/components/schemas/DubbedSegment.js";
type Obj = Record<string, unknown>;
const object = (v: unknown): v is Obj =>
  !!v && typeof v === "object" && !Array.isArray(v);
export class ResourceError extends Error {
  override name = "DubbingResourceError";
  constructor(
    public status: number,
    public code: string,
    message: string,
  ) {
    super(message);
  }
}
const fail = (status: number, code: string, message: string): never => {
  throw new ResourceError(status, code, message);
};
const invalid = (): never =>
  fail(
    400,
    "invalid_dubbing_resource_request",
    "Invalid local dubbing resource metadata",
  );
const clone = <T>(v: T): T => structuredClone(v);
export class Context {
  resources = new Map<string, DubbingResource>();
  speakerSettings = new Map<string, Record<string, Record<string, number>>>();
  nextSpeakerId = 1;
  nextSegmentId = 1;
  private resource(id: string) {
    return (
      this.resources.get(id) ??
      fail(404, "dubbing_resource_not_found", "Resource not found")
    );
  }
  private speaker(r: DubbingResource, id: string) {
    return Object.hasOwn(r.speaker_tracks, id)
      ? r.speaker_tracks[id]
      : fail(404, "dubbing_speaker_not_found", "Speaker not found");
  }
  private segment(r: DubbingResource, id: string) {
    return Object.hasOwn(r.speaker_segments, id)
      ? r.speaker_segments[id]
      : fail(404, "dubbing_segment_not_found", "Segment not found");
  }
  private languages(r: DubbingResource) {
    return [r.source_language, ...r.target_languages];
  }
  private language(r: DubbingResource, l: unknown): string {
    if (typeof l !== "string" || !this.languages(r).includes(l))
      fail(404, "dubbing_language_not_found", "Language not found");
    return l as string;
  }
  private span(r: DubbingResource, start: unknown, end: unknown) {
    if (
      typeof start !== "number" ||
      typeof end !== "number" ||
      !Number.isFinite(start) ||
      !Number.isFinite(end) ||
      start < 0 ||
      end <= start ||
      end > r.input.duration_secs
    )
      return invalid();
  }
  private dub(start: number, end: number, text: string | null): DubbedSegment {
    return {
      start_time: start,
      end_time: end,
      text,
      subtitles: [],
      audio_stale: true,
      media_ref: null,
    };
  }
  get(id: string) {
    return clone(this.resource(id));
  }
  addLanguage(id: string, v: unknown) {
    const r = this.resource(id);
    if (
      !object(v) ||
      Object.keys(v).some((k) => k !== "language") ||
      typeof v.language !== "string" ||
      !/^[a-z]{2,3}(?:-[A-Za-z0-9]{2,8})*$/.test(v.language)
    )
      return invalid();
    const language = v.language;
    if (this.languages(r).includes(language)) return { version: r.version };
    r.target_languages.push(language);
    for (const s of Object.values(r.speaker_segments))
      s.dubs[language] = this.dub(s.start_time, s.end_time, null);
    for (const t of Object.values(r.speaker_tracks))
      t.voices[language] = "track-clone";
    return { version: ++r.version };
  }
  createSegment(id: string, speaker: string, v: unknown) {
    const r = this.resource(id),
      track = this.speaker(r, speaker);
    if (
      !object(v) ||
      Object.keys(v).some(
        (k) => !["start_time", "end_time", "text", "translations"].includes(k),
      ) ||
      (v.text != null && typeof v.text !== "string")
    )
      return invalid();
    this.span(r, v.start_time, v.end_time);
    if (
      v.translations != null &&
      (!object(v.translations) ||
        Object.entries(v.translations).some(
          ([l, t]) => !r.target_languages.includes(l) || typeof t !== "string",
        ))
    )
      return invalid();
    const segment = `sim-resource-segment-created-${this.nextSegmentId++}`,
      start = v.start_time as number,
      end = v.end_time as number,
      translations = v.translations as
        Record<string, string> | null | undefined;
    r.speaker_segments[segment] = {
      id: segment,
      start_time: start,
      end_time: end,
      text: (v.text as string) ?? "",
      subtitles: [],
      dubs: Object.fromEntries(
        r.target_languages.map((l) => [
          l,
          this.dub(start, end, translations?.[l] ?? null),
        ]),
      ),
    };
    track.segments.push(segment);
    return { version: ++r.version, new_segment: segment };
  }
  updateSegment(id: string, segment: string, language: string, v: unknown) {
    const r = this.resource(id),
      s = this.segment(r, segment);
    this.language(r, language);
    if (
      !object(v) ||
      Object.keys(v).some(
        (k) => !["start_time", "end_time", "text"].includes(k),
      ) ||
      (v.text != null && typeof v.text !== "string")
    )
      return invalid();
    const target = language === r.source_language ? s : s.dubs[language];
    const start = v.start_time ?? target.start_time,
      end = v.end_time ?? target.end_time;
    this.span(r, start, end);
    target.start_time = start as number;
    target.end_time = end as number;
    if (v.text != null) target.text = v.text as string;
    target.subtitles = [];
    if (language === r.source_language)
      for (const d of Object.values(s.dubs)) d.audio_stale = true;
    else s.dubs[language].audio_stale = true;
    return { version: ++r.version };
  }
  migrate(id: string, v: unknown) {
    const r = this.resource(id);
    if (
      !object(v) ||
      Object.keys(v).some((k) => !["segment_ids", "speaker_id"].includes(k)) ||
      typeof v.speaker_id !== "string" ||
      !Array.isArray(v.segment_ids) ||
      v.segment_ids.some((s) => typeof s !== "string")
    )
      return invalid();
    const target = this.speaker(r, v.speaker_id),
      ids = [...new Set(v.segment_ids as string[])];
    for (const s of ids) this.segment(r, s);
    if (!ids.length) return { version: r.version };
    for (const t of Object.values(r.speaker_tracks))
      t.segments = t.segments.filter((s) => !ids.includes(s));
    target.segments.push(...ids);
    for (const s of ids)
      for (const d of Object.values(r.speaker_segments[s].dubs))
        d.audio_stale = true;
    return { version: ++r.version };
  }
  removeSegment(id: string, segment: string) {
    const r = this.resource(id);
    this.segment(r, segment);
    for (const t of Object.values(r.speaker_tracks))
      t.segments = t.segments.filter((s) => s !== segment);
    delete r.speaker_segments[segment];
    return { version: ++r.version };
  }
  private speakerInput(v: unknown, patch: boolean) {
    if (v == null) v = {};
    if (
      !object(v) ||
      Object.keys(v).some(
        (k) =>
          ![
            "speaker_name",
            "voice_id",
            "voice_stability",
            "voice_similarity",
            "voice_style",
            ...(patch ? ["languages"] : []),
          ].includes(k),
      ) ||
      (v.speaker_name != null &&
        (typeof v.speaker_name !== "string" || !v.speaker_name.trim())) ||
      (v.voice_id != null &&
        (typeof v.voice_id !== "string" || !v.voice_id.trim()))
    )
      return invalid();
    for (const k of ["voice_stability", "voice_similarity", "voice_style"])
      if (
        v[k] != null &&
        (typeof v[k] !== "number" ||
          !Number.isFinite(v[k]) ||
          Number(v[k]) < 0 ||
          Number(v[k]) > 1)
      )
        return invalid();
    if (
      v.languages != null &&
      (!Array.isArray(v.languages) ||
        v.languages.some((l) => typeof l !== "string"))
    )
      return invalid();
    return v;
  }
  createSpeaker(id: string, v: unknown) {
    const r = this.resource(id),
      input = this.speakerInput(v, false),
      speaker = `sim-resource-speaker-created-${this.nextSpeakerId++}`;
    r.speaker_tracks[speaker] = {
      id: speaker,
      media_ref: clone(r.input),
      speaker_name: (input.speaker_name as string) ?? "Untitled speaker",
      voices: Object.fromEntries(
        this.languages(r).map((l) => [
          l,
          (input.voice_id as string) ?? "track-clone",
        ]),
      ),
      segments: [],
    };
    this.storeSettings(id, speaker, this.languages(r), input);
    return { version: ++r.version, speaker_id: speaker };
  }
  private storeSettings(
    id: string,
    speaker: string,
    languages: string[],
    input: Obj,
  ) {
    const key = `${id}/${speaker}`,
      settings = this.speakerSettings.get(key) ?? {};
    for (const l of languages) {
      settings[l] ??= {
        voice_stability: 0.65,
        voice_similarity: 1,
        voice_style: 1,
      };
      for (const k of ["voice_stability", "voice_similarity", "voice_style"])
        if (input[k] != null) settings[l][k] = input[k] as number;
    }
    this.speakerSettings.set(key, settings);
  }
  updateSpeaker(id: string, speaker: string, v: unknown) {
    const r = this.resource(id),
      track = this.speaker(r, speaker),
      input = this.speakerInput(v, true),
      languages = input.languages as string[] | null | undefined;
    const selected = languages?.length
      ? [...new Set(languages)]
      : this.languages(r);
    for (const l of selected) this.language(r, l);
    if (input.speaker_name != null)
      track.speaker_name = input.speaker_name as string;
    for (const l of selected)
      if (input.voice_id != null) track.voices[l] = input.voice_id as string;
    this.storeSettings(id, speaker, selected, input);
    if (
      ["voice_id", "voice_stability", "voice_similarity", "voice_style"].some(
        (k) => input[k] != null,
      )
    )
      for (const sid of track.segments)
        for (const l of selected)
          if (r.speaker_segments[sid].dubs[l])
            r.speaker_segments[sid].dubs[l].audio_stale = true;
    return { version: ++r.version };
  }
}
