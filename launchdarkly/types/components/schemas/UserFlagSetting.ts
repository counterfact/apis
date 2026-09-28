import type { EvaluationReason } from "./EvaluationReason.js";

export type UserFlagSetting = {
  /**
   * The location and content type of related resources.
   * @example {"sort.order":{"href":"/api/v2/users/lacuna/production/Abbie_Braun/flags/sort.order","type":"application/json"}}
   */
  _links: { [key: string]: unknown };
  /**
   * The value of the flag variation that the user receives. If there is no defined default rule, this is null.
   * @example "true"
   */
  _value: unknown;
  /**
   * Whether the user is explicitly targeted to receive a particular variation. The setting is false if you have turned off a feature flag for a user. It is null if you haven't assigned that user to a specific variation.
   * @example "null"
   */
  setting: unknown;
  /**
   * Contains information about why that variation was selected.
   * @example "{\"kind\": \"RULE_MATCH\"}"
   */
  reason?: EvaluationReason;
};
