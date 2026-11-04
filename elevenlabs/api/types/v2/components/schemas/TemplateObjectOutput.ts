import type { TemplateRunStatus } from "./TemplateRunStatus.js";
import type { TemplateOutput } from "./TemplateOutput.js";
/**
 * An `object` output, delivered as `content` once completed: one output per
 * field of the schema's `properties`, each an output in its own right with
 * its own `status`. There are no dynamic fields.
 */
export type TemplateObjectOutput = {
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
  type: "object";
  /**
   * One output per field, keyed by field name, each following the shape of that field's schema. Present only when `status` is `completed`. Reserved: no template produces this kind of output yet; it is published so that templates which do can be run with the same client.
   */
  content?: { [key: string]: TemplateOutput } | null;
};
