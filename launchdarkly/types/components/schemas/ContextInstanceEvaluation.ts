import type { ContextInstanceEvaluationReason } from "./ContextInstanceEvaluationReason.js";

export type ContextInstanceEvaluation = {
  /**
   * Name of the flag.
   * @example "My Flag"
   */
  name: string;
  /**
   * Key of the flag.
   * @example "flag-key-123abc"
   */
  key: string;
  /**
   * The value of the flag variation that the context receives. If there is no defined default rule, this is null.
   * @example "true"
   */
  _value: unknown;
  /**
   * Contains information about why that variation was selected.
   * @example "{\"kind\": \"RULE_MATCH\"}"
   */
  reason?: ContextInstanceEvaluationReason;
  /**
   * The location and content type of related resources
   * @example {"self":{"href":"/api/v2/projects/{projectKey}/environments/{environmentKey}/flags/evaluate","type":"application/json"},"site":{"href":"/my-project/my-environment/features/sort.order/targeting","type":"text/html"}}
   */
  _links: { [key: string]: unknown };
};
