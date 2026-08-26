import type { ProjectSummary } from "./ProjectSummary.js";

export type TeamProjects = {
  /**
   * @example 1
   */
  totalCount?: number;
  /**
   * Details on each project where team members have write privileges on at least one resource type (e.g. flags)
   * @example [{"_links":{"environments":{"href":"/api/v2/projects/example-project/environments","type":"application/json"},"self":{"href":"/api/v2/projects/example-project","type":"application/json"}},"key":"project-key-123abc","name":"Example project"}]
   */
  items?: Array<ProjectSummary>;
};
