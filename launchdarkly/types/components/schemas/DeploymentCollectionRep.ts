import type { DeploymentRep } from "./DeploymentRep.js";

export type DeploymentCollectionRep = {
  /**
   * The total number of deployments
   * @example 25
   */
  totalCount: number;
  /**
   * A list of deployments
   */
  items: Array<DeploymentRep>;
  /**
   * The location and content type of related resources
   * @example {"next":{"href":"/api/v2/engineering-insights/deployments?after=a4290006-1fd1-4ca5-acf7-9f31fac61cf5","type":"application/json"},"self":{"href":"/api/v2/engineering-insights/deployments","type":"application/json"}}
   */
  _links?: { [key: string]: unknown };
};
