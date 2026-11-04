import type { TemplateSummary } from "./TemplateSummary.js";
/**
 * One page of the templates the caller can run, most recently updated first.
 * @example {"has_more":true,"next_cursor":"cGFnZXwx","templates":[{"description":"Drop in a product photo, get a studio shot.","has_more_versions":false,"id":"tmpl_abc123","name":"Product shot","versions":[{"inputs":[{"content_schema":{"title":"Prompt","type":"string"},"id":"prompt"},{"content_schema":{"description":"A clean product photo on any background.","title":"Product photo","type":"image"},"id":"reference"}],"is_latest":true,"outputs":[{"content_schema":{"title":"Final image","type":"image"},"id":"product_still"}],"published_at_unix":1739721600,"version_id":"ver_01hxyz"}]}]}
 */
export type TemplateListResponse = {
  /**
   * The templates on this page, most recently updated first. A page can hold fewer than `page_size` templates, or none at all, because templates you cannot run are filtered out after the page is read — keep paging while `has_more` is true.
   */
  templates: Array<TemplateSummary>;
  /**
   * Pass as `cursor` to fetch the next page. `null` when there is no further page.
   */
  next_cursor: string | null;
  /**
   * Whether more templates exist beyond this page.
   */
  has_more: boolean;
};
