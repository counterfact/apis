/**
 * Parameters to be used for the commit_author_email_pattern rule
 */
export type repository_rule_commit_author_email_pattern = {
  type: "commit_author_email_pattern";
  parameters?: {
    /**
     * How this rule appears when configuring it.
     */
    name?: string;
    /**
     * If true, the rule will fail if the pattern matches.
     */
    negate?: boolean;
    /**
     * The operator to use for matching.
     */
    operator: "starts_with" | "ends_with" | "contains" | "regex";
    /**
     * The pattern to match with.
     */
    pattern: string;
  };
};
