export type RuleClause = {
  /**
   * The attribute the rule applies to, for example, last name or email address
   */
  attribute?: string;
  /**
   * The operator to apply to the given attribute
   */
  op?:
    | "in"
    | "endsWith"
    | "startsWith"
    | "matches"
    | "contains"
    | "lessThan"
    | "lessThanOrEqual"
    | "greaterThan"
    | "greaterThanOrEqual"
    | "before"
    | "after"
    | "segmentMatch"
    | "semVerEqual"
    | "semVerLessThan"
    | "semVerGreaterThan";
  /**
   * Whether the operator should be negated
   */
  negate?: boolean;
};
