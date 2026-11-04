import type { TemplateRunStatus } from "./TemplateRunStatus.js";
import type { TemplateOutput } from "./TemplateOutput.js";
/**
 * An `array` output, delivered as `content` once completed: one output per
 * element, each an output in its own right with its own `status`. A list can
 * be arbitrarily long, so `content` is its first page; when `has_more` is
 * true, `next_cursor` leads to the rest.
 */
export type TemplateArrayOutput = {
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
  type: "array";
  /**
   * The first elements of the list, in order, each following the shape of the schema's `items`. Present only when `status` is `completed`. When `has_more` is true this is not the whole list. Reserved: no template produces this kind of output yet; it is published so that templates which do can be run with the same client.
   */
  content?: Array<TemplateOutput> | null;
  /**
   * Pass as `cursor` to a later endpoint to fetch the elements after `content`. `null` when `content` holds the whole list, or before the output completes. Reserved: no template produces this kind of output yet; it is published so that templates which do can be run with the same client.
   */
  next_cursor?: string | null;
  /**
   * Whether the list has elements beyond `content`.
   */
  has_more: boolean;
};
