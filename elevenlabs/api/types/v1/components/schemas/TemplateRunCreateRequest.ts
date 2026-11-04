import type { TemplateRunInput } from "./TemplateRunInput.js";
import type { WebhookTarget } from "./WebhookTarget.js";
/**
 * Request body of ``POST /v1/flows/templates/{template_id}/runs``.
 * @example {"inputs":{"prompt":"a corgi on a surfboard","reference":{"asset_id":"5xM2KqOnZyce22SPZ9d4","type":"asset"}},"version_id":"latest","webhook":{"type":"all"}}
 */
export type TemplateRunCreateRequest = {
  /**
   * Input values keyed by input port id. Every input port of the version being run must be given; a missing or unknown id is rejected. Pass `{}` for a template with no inputs.
   */
  inputs: { [key: string]: TemplateRunInput };
  /**
   * The template snapshot to run. Pass a specific version id to pin that snapshot, or `latest` (the default when omitted) to run the template's most recently published version. Only published versions can be pinned, except by the template's owner, who may also pin an unpublished saved snapshot to try it out before publishing. The live draft is never run through this API.
   */
  version_id?: string | null;
  /**
   * Include to send the run's result to the workspace's configured flows webhooks once the run's `status` reaches `completed` or `failed`. One event for the whole run: the `flows_template_run` event's `data` matches the terminal response of `GET /v1/flows/templates/{template_id}/runs/{run_id}`.
   */
  webhook?: WebhookTarget | null;
};
