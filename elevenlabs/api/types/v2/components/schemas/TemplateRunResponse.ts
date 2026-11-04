import type { TemplateRunStatus } from "./TemplateRunStatus.js";
import type { TemplateOutput } from "./TemplateOutput.js";
/**
 * A template run and its outputs. Every output exists from the moment the
 * run is created and reports its own `status`; the run's `status` rolls them
 * up, and the run is finished once it is `completed` or `failed`.
 * @example {"id":"sess_JWr5N6X9ZTqf8jD2LmQb","outputs":{"marketing_title":{"content":"Ride the wave.","id":"Kx2mP7Y4WVrg9kE3NnRc","status":"completed","type":"string"},"product_demo":{"id":"QWr5N6X9ZTqf8jD2La3B","status":"generating","type":"video"},"product_still":{"content_mime_type":"image/png","content_url":"https://storage.googleapis.com/generations/JWr5N6X9ZTqf8jD2LmQb","id":"JWr5N6X9ZTqf8jD2LmQb","status":"completed","type":"image"}},"status":"generating","template_id":"tmpl_abc123","version_id":"ver_01hxyz"}
 */
export type TemplateRunResponse = {
  /**
   * The unique identifier of the run.
   */
  id: string;
  /**
   * The template this run executed, so a webhook consumer running several templates can tell their runs apart without keeping a run-to-template map.
   */
  template_id: string;
  /**
   * The template version this run executed. Resolved when the run is created, so a run started with `latest` records the concrete version it ran.
   */
  version_id: string;
  /**
   * The run's status, rolled up from its outputs: `pending` until an output starts, `generating` while any output is unfinished, `completed` once every output has completed, and `failed` once every output has finished and at least one failed. `completed` and `failed` are terminal: the `flows_template_run` webhook fires once the run reaches either.
   */
  status: TemplateRunStatus;
  /**
   * The run's outputs, keyed by output port id. Each is a `TemplateOutput` discriminated on `type`, the `type` of its port's `content_schema`.
   */
  outputs: { [key: string]: TemplateOutput };
};
