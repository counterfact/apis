import type { Project } from "./Project.js";

export type Projects = {
  /**
   * A link to this resource.
   * @example {"self":{"href":"/api/v2/projects","type":"application/json"}}
   */
  _links: { [key: string]: unknown };
  /**
   * List of projects.
   */
  items: Array<Project>;
  totalCount?: number;
};
