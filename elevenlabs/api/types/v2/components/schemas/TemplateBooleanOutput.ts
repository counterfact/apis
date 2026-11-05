import type { TemplateRunStatus } from "./TemplateRunStatus.js";
/**
 * A `boolean` output, delivered as `content` once completed.
 */
export type TemplateBooleanOutput = {
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
   * The kind of output: the `type` of the port's `content_schema`.
   */
  type: "boolean";
  /**
   * The generated boolean. Present only when `status` is `completed`. Reserved: no template produces this kind of output yet; it is published so that templates which do can be run with the same client.
   */
  content?: boolean | null;
};
