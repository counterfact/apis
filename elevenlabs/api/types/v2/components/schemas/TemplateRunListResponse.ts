import type { TemplateRunResponse } from "./TemplateRunResponse.js";
/**
 * One page of the caller's public-API template runs, newest first.
 * @example {"has_more":true,"next_cursor":"MjAyNi0wNy0xN1QxMjowMDowMHxLeDJtUDdZNFdWcmc5a0UzTm5SYw","runs":[{"id":"sess_JWr5N6X9ZTqf8jD2LmQb","outputs":{"marketing_title":{"content":"Ride the wave.","id":"Kx2mP7Y4WVrg9kE3NnRc","status":"completed","type":"string"},"product_demo":{"id":"QWr5N6X9ZTqf8jD2La3B","status":"generating","type":"video"},"product_still":{"content_mime_type":"image/png","content_url":"https://storage.googleapis.com/generations/JWr5N6X9ZTqf8jD2LmQb","id":"JWr5N6X9ZTqf8jD2LmQb","status":"completed","type":"image"}},"status":"generating","template_id":"tmpl_abc123","version_id":"ver_01hxyz"}]}
 */
export type TemplateRunListResponse = {
  /**
   * The runs on this page, newest first. Each item has the same shape as `GET /v1/flows/templates/{template_id}/runs/{run_id}`.
   */
  runs: Array<TemplateRunResponse>;
  /**
   * Pass as `cursor` to fetch the next page. `null` when there is no further page.
   */
  next_cursor: string | null;
  /**
   * Whether more runs exist beyond this page.
   */
  has_more: boolean;
};
