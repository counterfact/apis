import type { ContextRecord } from "./ContextRecord.js";

export type Contexts = {
  /**
   * The location and content type of related resources
   * @example {"next":{"href":"/app.launchdarkly.com/api/v2/projects/my-project/environments/my-environment/contexts?filter=kind:{\"equals\": [\"organization\"]}&limit=2&continuationToken=QAGFKH1313KUGI2351","type":"application/json"},"self":{"href":"/api/v2/projects/my-proj/environments/my-env/contexts?filter=kind:{\"equals\": [\"organization\"]}&limit=2&continuationToken=QAGFKH1313KUGI2351","type":"application/json"}}
   */
  _links?: { [key: string]: unknown };
  /**
   * The number of contexts
   * @example 100
   */
  totalCount?: number;
  /**
   * The environment ID where the context was evaluated
   * @example "57be1db38b75bf0772d11384"
   */
  _environmentId: string;
  /**
   * An obfuscated string that references the last context instance on the previous page of results. You can use this for pagination, however, we recommend using the <code>next</code> link instead.
   * @example "QAGFKH1313KUGI2351"
   */
  continuationToken?: string;
  /**
   * A collection of contexts. Can include multiple versions of contexts that have the same <code>kind</code> and <code>key</code>, but different <code>applicationId</code>s.
   */
  items: Array<ContextRecord>;
};
