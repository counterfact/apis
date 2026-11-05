import { createHash } from "node:crypto";
import type { Context as Root } from "../../_.context.js";
import { defaultSettings } from "../../_.context.js";
import type { VoiceResponseModel as Voice } from "../../../types/v1/components/schemas/VoiceResponseModel.js";
export class PvcError extends Error {
  override name = "PvcError";
  constructor(
    public status: number,
    public code: string,
  ) {
    super(code);
  }
}
const fail = (status: number, code: string): never => {
  throw new PvcError(status, code);
};
const object = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
export class Context {
  nextSample = 0;
  captchaRequests = new Map<string, { recording: Uint8Array; status: "pending" | "completed" }>();
  verificationRequests = new Map<string, { files: {data: Uint8Array; filename: string; contentType: string}[]; extraText?: string; status: "pending" | "completed" }>();
  private upload(input: unknown, document = false) {
    if (!object(input) || !(input.data instanceof Uint8Array) ||
        typeof input.filename !== "string" || !input.filename.trim() || input.filename.length > 255 ||
        typeof input.contentType !== "string" || !(document ? ["application/pdf", "image/jpeg", "image/png"] : ["audio/mpeg"]).includes(input.contentType) ||
        input.size !== input.data.byteLength || input.data.byteLength === 0 || input.data.byteLength > 10 * 1024 * 1024)
      return fail(400, "invalid_upload");
    return {data:new Uint8Array(input.data),filename:input.filename,contentType:input.contentType};
  }
  private uploads(input: unknown, document = false) {
    if (!Array.isArray(input) || input.length === 0 || input.length > 20) return fail(400, "invalid_upload_files");
    const files = input.map(f => this.upload(f, document));
    if (files.reduce((n,f) => n + f.data.byteLength,0) > 10 * 1024 * 1024) return fail(400,"upload_size_exceeded");
    return files;
  }
  addSamples(id: string, input: unknown) {
    const voice=this.voice(id); this.idle(id);
    if (!object(input) || Object.keys(input).some(k => !["files","remove_background_noise"].includes(k))) return fail(400,"invalid_sample_options");
    if (input.remove_background_noise !== undefined && input.remove_background_noise !== false) return fail(400,"noise_removal_unsupported");
    const files=this.uploads(input.files);
    if ((voice.samples?.length ?? 0) + files.length > 20) return fail(409,"sample_limit_exceeded");
    const audio=new Map(this.sampleAudio.get(id)), samples=structuredClone(voice.samples ?? []);
    let next=this.nextSample;
    const added=files.map(file => {
      let sid:string; do {sid=`sim-pvc-uploaded-sample-${++next}`;} while(samples.some(s=>s.sample_id===sid));
      const sample={sample_id:sid,file_name:file.filename,mime_type:file.contentType,size_bytes:file.data.byteLength,
        hash:createHash("sha256").update(file.data).digest("hex"),remove_background_noise:false,has_isolated_audio:false,has_isolated_audio_preview:false};
      samples.push(sample); audio.set(sid,file.data); return sample;
    });
    voice.samples=samples; this.sampleAudio.set(id,audio); this.nextSample=next;
    return structuredClone(added);
  }
  submitCaptcha(id: string, input: unknown) {
    const voice=this.voice(id); this.idle(id);
    if (!object(input) || Object.keys(input).some(k=>k!=="recording")) return fail(400,"invalid_captcha_options");
    const recording=this.upload(input.recording).data;
    if (this.captchaRequests.get(id)?.status === "pending") return fail(409,"verification_pending");
    if (!voice.fine_tuning) return fail(409,"verification_unavailable");
    this.captchaRequests.set(id,{recording,status:"pending"});
    voice.fine_tuning.verification_attempts_count=(voice.fine_tuning.verification_attempts_count ?? 0)+1;
    return {status:"ok"};
  }
  requestVerification(id: string, input: unknown) {
    const voice=this.voice(id); this.idle(id);
    if (!object(input) || Object.keys(input).some(k=>!["files","extra_text"].includes(k)) ||
        input.extra_text != null && (typeof input.extra_text !== "string" || input.extra_text.length>5000)) return fail(400,"invalid_verification_options");
    const files=this.uploads(input.files,true);
    if (this.verificationRequests.get(id)?.status === "pending") return fail(409,"verification_pending");
    if (!voice.fine_tuning) return fail(409,"verification_unavailable");
    this.verificationRequests.set(id,{files,extraText:input.extra_text as string | undefined,status:"pending"});
    voice.fine_tuning.manual_verification_requested=true;
    return {status:"ok"};
  }
  sampleAudio = new Map<string, Map<string, Uint8Array>>();
  separation = new Map<string, Map<string, { audio: Uint8Array; duration: number }>>();
  training = new Map<string, { model: string; samples: import("../../../types/v1/components/schemas/SampleResponseModel.js").SampleResponseModel[]; audio: Uint8Array[]; language: string; status: "queued" | "completed" }>();
  challenge?: string;
  private voice(id: string, professional = true) {
    const voice = this.owner().voices.get(id);
    if (!voice) return fail(404, "voice_not_found");
    if (professional && voice.category !== "professional") return fail(409, "voice_not_professional");
    if (voice.is_owner !== true) return fail(403, "voice_not_owned");
    return voice;
  }
  private idle(id: string) {
    if (this.training.get(id)?.status === "queued") return fail(409, "voice_training_pending");
  }
  private sample(id: string, sid: string, professional = true) {
    const voice = this.voice(id, professional);
    const sample = voice.samples?.find(s => s.sample_id === sid);
    if (!sample) return fail(404, "sample_not_found");
    return sample;
  }
  purgeVoice(id: string) { this.captchaRequests.delete(id); this.verificationRequests.delete(id); this.sampleAudio.delete(id); this.separation.delete(id); this.training.delete(id); }
  audio(id: string, sid: string) {
    this.sample(id, sid, false);
    const bytes = this.sampleAudio.get(id)?.get(sid);
    if (!bytes) return fail(404, "sample_audio_not_found");
    return new Uint8Array(bytes);
  }
  preview(id: string, sid: string, removeNoise?: boolean) {
    const sample = this.sample(id, sid);
    if (removeNoise !== undefined && removeNoise !== false) return fail(400, "noise_removal_unsupported");
    return { voice_id: id, sample_id: sid, audio_base_64: Buffer.from(this.audio(id,sid)).toString("base64"), media_type: "audio/mpeg", duration_secs: sample.duration_secs };
  }
  waveform(id: string, sid: string) {
    this.sample(id,sid); this.audio(id,sid);
    return {sample_id:sid, visual_waveform:new Array<number>(20).fill(0)};
  }
  speakers(id: string, sid: string) {
    const sample = this.sample(id,sid);
    return structuredClone(sample.speaker_separation ?? {voice_id:id,sample_id:sid,status:"not_started" as const});
  }
  separate(id: string, sid: string) {
    this.idle(id);
    const sample = this.sample(id,sid);
    if (sample.speaker_separation?.status === "pending") return fail(409,"sample_busy");
    if (sample.speaker_separation?.status === "completed") return fail(409,"separation_already_completed");
    if (sample.duration_secs == null) return fail(400,"sample_duration_unavailable");
    const capture = {audio:this.audio(id,sid),duration:sample.duration_secs};
    let jobs=this.separation.get(id); if (!jobs) {jobs=new Map();this.separation.set(id,jobs);}
    jobs.set(sid,capture);
    sample.speaker_separation={voice_id:id,sample_id:sid,status:"pending"};
    return {status:"ok"};
  }
  speakerAudio(id: string,sid: string,speaker: string) {
    const sample=this.sample(id,sid);
    if(sample.speaker_separation?.status!=="completed") return fail(409,"separation_not_completed");
    if(!sample.speaker_separation.speakers?.[speaker]) return fail(404,"speaker_not_found");
    const captured=this.separation.get(id)?.get(sid);
    if(!captured) return fail(404,"speaker_audio_not_found");
    return {audio_base_64:Buffer.from(captured.audio).toString("base64"),media_type:"audio/mpeg",duration_secs:captured.duration};
  }
  updateSample(id: string,sid: string,input: unknown) {
    this.idle(id); const sample=this.sample(id,sid);
    if(sample.speaker_separation?.status==="pending") return fail(409,"sample_busy");
    if(!object(input) || Object.keys(input).some(k=>!["file_name","remove_background_noise","selected_speaker_ids","trim_start_time","trim_end_time"].includes(k))) return fail(400,"unsupported_sample_options");
    if(input.remove_background_noise!==undefined && input.remove_background_noise!==false) return fail(400,"noise_removal_unsupported");
    if(input.file_name!=null && (typeof input.file_name!=="string" || !input.file_name.trim() || input.file_name.length>255)) return fail(400,"invalid_sample_name");
    if(input.trim_start_time!=null && input.trim_start_time!==0 || input.trim_end_time!=null && input.trim_end_time!==sample.duration_secs!*1000) return fail(400,"trimming_unsupported");
    const ids=input.selected_speaker_ids;
    if(ids!=null && (!Array.isArray(ids) || ids.some(s=>typeof s!=="string" || !sample.speaker_separation?.speakers?.[s]) || sample.speaker_separation?.status!=="completed")) return fail(400,"invalid_selected_speakers");
    const next=structuredClone(sample);
    if(input.file_name!=null) next.file_name=input.file_name as string;
    if(input.remove_background_noise!==undefined) next.remove_background_noise=false;
    if(input.trim_start_time!=null) next.trim_start=0;
    if(input.trim_end_time!=null) next.trim_end=sample.duration_secs;
    if(ids!=null) next.speaker_separation!.selected_speaker_ids=[...new Set(ids as string[])];
    this.voice(id).samples=this.voice(id).samples!.map(s=>s.sample_id===sid?next:s);
    return {voice_id:id};
  }
  deleteSample(id: string,sid: string,professional=false) {
    this.idle(id);this.sample(id,sid,professional);
    this.voice(id,professional).samples=this.voice(id,professional).samples!.filter(s=>s.sample_id!==sid);
    this.sampleAudio.get(id)?.delete(sid);this.separation.get(id)?.delete(sid);
    return {status:"ok"};
  }
  captcha(id: string) {this.voice(id); if(!this.challenge) throw new Error("Run startup or reset"); return this.challenge;}
  train(id: string,input: unknown) {
    const voice=this.voice(id); this.idle(id);
    if(!object(input) || Object.keys(input).some(k=>k!=="model_id") || input.model_id!=null && input.model_id!=="eleven_multilingual_v2") return fail(400,"unsupported_training_model");
    if(!voice.samples?.length) return fail(409,"voice_has_no_samples");
    if(!voice.fine_tuning?.is_allowed_to_fine_tune) return fail(409,"voice_not_verified");
    if(voice.samples.some(s=>s.speaker_separation?.status==="pending")) return fail(409,"sample_busy");
    if(voice.samples.some(s=>s.speaker_separation?.selected_speaker_ids?.length===0)) return fail(409,"sample_has_no_selected_speakers");
    const model=this.owner().models.get("eleven_multilingual_v2");
    if(!model) return fail(404,"model_not_found");
    if(!model.can_be_finetuned) return fail(409,"model_not_trainable");
    const capture={model:model.model_id,samples:structuredClone(voice.samples),audio:voice.samples.map(s=>this.audio(id,s.sample_id)),language:voice.fine_tuning.language!,status:"queued" as const};
    this.training.set(id,capture);
    voice.fine_tuning.state[model.model_id]="queued";
    return {status:"ok"};
  }

  root?: () => Root;
  nextVoice = 0;
  createdAt?: number;
  private owner() {
    if (!this.root || this.createdAt === undefined)
      throw new Error("Run startup or reset");
    return this.root();
  }
  private validate(input: unknown, create: boolean) {
    if (
      !object(input) ||
      Object.keys(input).some(
        (key) => !["name", "language", "description", "labels"].includes(key),
      ) ||
      ["name", "language"].some(
        (key) =>
          (create || input[key] !== undefined) &&
          (typeof input[key] !== "string" || !(input[key] as string).trim()),
      ) ||
      (input.description != null && typeof input.description !== "string") ||
      (input.labels != null &&
        (!object(input.labels) ||
          Object.values(input.labels).some(
            (value) => typeof value !== "string",
          )))
    )
      return fail(400, "invalid_pvc_metadata");
    return input;
  }
  private labels(
    body: Record<string, unknown>,
    language: string,
    previous: Record<string, string> = {},
  ) {
    const labels = structuredClone(
      (body.labels ?? previous) as Record<string, string>,
    );
    if (labels.language !== undefined && labels.language !== language) {
      // An explicit label cannot contradict the separately supplied sample language.
      if (body.labels != null) return fail(400, "conflicting_voice_language");
    }
    return { ...labels, language };
  }
  create(input: unknown) {
    const root = this.owner(),
      body = this.validate(input, true);
    const language = body.language as string,
      labels = this.labels(body, language);
    let id: string;
    do {
      id = `sim-pvc-created-${++this.nextVoice}`;
    } while (root.voices.has(id));
    const value: Voice = {
      voice_id: id,
      name: body.name as string,
      category: "professional",
      labels,
      description: (body.description as string | null | undefined) ?? null,
      samples: [],
      available_for_tiers: [],
      high_quality_base_model_ids: [],
      settings: defaultSettings(),
      is_owner: true,
      is_legacy: false,
      created_at_unix: this.createdAt! + this.nextVoice,
      fine_tuning: {
        is_allowed_to_fine_tune: false,
        state: {},
        verification_failures: [],
        verification_attempts_count: 0,
        manual_verification_requested: false,
        language,
      },
    };
    root.voices.set(id, value);
    return { voice_id: id };
  }
  update(id: string, input: unknown) {
    const root = this.owner(),
      previous = root.voices.get(id);
    if (!previous) return fail(404, "voice_not_found");
    if (previous.category !== "professional")
      return fail(409, "voice_not_professional");
    if (previous.is_owner !== true) return fail(403, "voice_not_owned");
    this.idle(id);
    const body = this.validate(input, false);
    const language =
      (body.language as string | undefined) ??
      previous.fine_tuning?.language ??
      previous.labels.language;
    if (!language) return fail(409, "voice_language_unavailable");
    const next = structuredClone(previous);
    next.labels = this.labels(body, language, previous.labels);
    if (body.name !== undefined) next.name = body.name as string;
    if (Object.hasOwn(body, "description"))
      next.description = body.description as string | null;
    if (next.fine_tuning) next.fine_tuning.language = language;
    root.voices.set(id, next);
    return { voice_id: id };
  }
}
