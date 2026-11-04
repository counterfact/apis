import type { TemplateRunStatus } from "./TemplateRunStatus.js";
/**
 * An `audio` output, downloaded from `content_url` once completed.
 */
export type TemplateAudioOutput = {
  /**
   * The id of the generation behind this output. Pass it as a `generation` reference to use the output as an input elsewhere.
   */
  id: string;
  /**
   * The lifecycle status of the output. It ends at `completed`, when the output's content fields are set, or `failed`, when `failure_reason` and `error_message` are set.
   */
  status: TemplateRunStatus;
  /**
   * The category of failure. Present only when `status` is `failed`.
   */
  failure_reason?:
    | (
        | "timeout"
        | "model_error"
        | "moderated"
        | "invalid_parameters"
        | "dependency_failed"
        | "charging_failed"
        | "internal_error"
      )
    | null;
  /**
   * A human-readable description of the failure. Present only when `status` is `failed`. Failed generations are not charged.
   */
  error_message?: string | null;
  /**
   * A signed URL to download the generated media from. Present only when `status` is `completed`. It expires about an hour after this response is returned; fetch the run again for a fresh URL.
   */
  content_url?: string | null;
  /**
   * The MIME type of the generated media. Present only when `status` is `completed`.
   */
  content_mime_type?: string | null;
  /**
   * The kind of output: the `type` of the port's `content_schema`.
   */
  type: "audio";
};
