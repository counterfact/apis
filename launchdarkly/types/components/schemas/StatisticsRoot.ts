import type { Link } from "./Link.js";

export type StatisticsRoot = {
  /**
   * The location and content type of all projects that have code references
   * @example [{"href":"/api/v2/code-refs/statistics/example-project-with-code-refs","type":"application/json"}]
   */
  projects?: Array<Link>;
  /**
   * The location and content type for accessing this resource
   * @example "{\"href\": \"/api/v2/code-refs/statistics\", \"type\": \"application/json\"}"
   */
  self?: Link;
};
