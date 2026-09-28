import type { ContextInstanceEvaluation } from "./ContextInstanceEvaluation.js";

export type ContextInstanceEvaluations = {
  /**
   * Details on the flag evaluations for this context instance
   * @example [{"_links":{"self":{"href":"/api/v2/projects/{projectKey}/environments/{environmentKey}/flags/evaluate","type":"application/json"},"site":{"href":"/my-project/my-environment/features/sort.order/targeting","type":"text/html"}},"_value":true,"key":"sort.order","name":"SortOrder","reason":{"kind":"FALLTHROUGH"}},{"_links":{"self":{"href":"/api/v2/projects/{projectKey}/environments/{environmentKey}/flags/evaluate","type":"application/json"},"site":{"href":"/my-project/my-environment/features/alternate.page/targeting","type":"text/html"}},"_value":false,"key":"alternate.page","name":"AlternatePage","reason":{"kind":"RULE_MATCH","ruleID":"b2530cdf-14c6-4e16-b660-00239e08f19b","ruleIndex":1}}]
   */
  items: Array<ContextInstanceEvaluation>;
  /**
   * The number of flags
   * @example 2
   */
  totalCount?: number;
  /**
   * The location and content type of related resources
   * @example {"self":{"href":"/api/v2/projects/{projectKey}/environments/{environmentKey}/flags/evaluate","type":"application/json"}}
   */
  _links: { [key: string]: unknown };
};
