import type { ContextInstanceRecord } from "./ContextInstanceRecord.js";

export type ContextInstances = {
  /**
   * The location and content type of related resources
   * @example {"next":{"href":"/api/v2/projects/my-project/environments/my-env/context-instances/organization:launch-darkly:user:henry?limit=2&continuationToken=2022-04-15T15:00:57.526470334Z","type":"application/json"},"self":{"href":"/api/v2/projects/my-proj/environments/my-env/context-instances/organization:launch-darkly:user:henry-jacobs?limit=2","type":"application/json"}}
   */
  _links?: { [key: string]: unknown };
  /**
   * The number of unique context instances
   * @example 100
   */
  totalCount?: number;
  /**
   * The environment ID
   * @example "57be1db38b75bf0772d11384"
   */
  _environmentId: string;
  /**
   * An obfuscated string that references the last context instance on the previous page of results. You can use this for pagination, however, we recommend using the <code>next</code> link instead.
   * @example "QAGFKH1313KUGI2351"
   */
  continuationToken?: string;
  /**
   * A collection of context instances. Can include multiple versions of context instances that have the same <code>id</code>, but different <code>applicationId</code>s.
   */
  items: Array<ContextInstanceRecord>;
};
