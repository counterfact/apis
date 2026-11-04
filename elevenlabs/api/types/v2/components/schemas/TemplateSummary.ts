import type { TemplateVersion } from "./TemplateVersion.js";
/**
 * A template the caller can run, and its runnable versions.
 */
export type TemplateSummary = {
  /**
   * Pass as `template_id` on `POST /v1/flows/templates/{template_id}/runs`.
   */
  id: string;
  /**
   * The template's name.
   */
  name: string;
  /**
   * The template's description, if it has one.
   */
  description?: string | null;
  /**
   * The published versions this caller can run, newest first. A version whose graph uses a model that is not available to you through the API is left out, as is one whose stored snapshot is gone; either way the list can be empty while the template still has versions the ElevenLabs app can run.
   */
  versions: Array<TemplateVersion>;
  /**
   * Whether this template has further published versions beyond the `versions_per_template` returned here. Fetch `GET /v1/flows/templates/{template_id}` with a larger `versions_per_template` to see more of them.
   */
  has_more_versions: boolean;
};
