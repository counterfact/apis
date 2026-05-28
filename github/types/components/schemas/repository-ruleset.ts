import type { repository_rule_enforcement } from "./repository-rule-enforcement.js";
import type { repository_ruleset_bypass_actor } from "./repository-ruleset-bypass-actor.js";
import type { repository_ruleset_conditions } from "./repository-ruleset-conditions.js";
import type { org_ruleset_conditions } from "./org-ruleset-conditions.js";
import type { repository_rule } from "./repository-rule.js";

/**
 * A set of rules to apply when specified conditions are met.
 */
export type repository_ruleset = {
  /**
   * The ID of the ruleset
   */
  id: number;
  /**
   * The name of the ruleset
   */
  name: string;
  /**
   * The target of the ruleset
   */
  target?: "branch" | "tag" | "push" | "repository";
  /**
   * The type of the source of the ruleset
   */
  source_type?: "Repository" | "Organization" | "Enterprise";
  /**
   * The name of the source
   */
  source: string;
  enforcement: repository_rule_enforcement;
  /**
   * The actors that can bypass the rules in this ruleset
   */
  bypass_actors?: Array<repository_ruleset_bypass_actor>;
  /**
   * The bypass type of the user making the API request for this ruleset. This field is only returned when
   * querying the repository-level endpoint.
   */
  current_user_can_bypass?:
    | "always"
    | "pull_requests_only"
    | "never"
    | "exempt";
  node_id?: string;
  _links?: {
    self?: {
      /**
       * The URL of the ruleset
       */
      href?: string;
    };
    html?: {
      /**
       * The html URL of the ruleset
       */
      href?: string;
    };
  };
  conditions?: repository_ruleset_conditions | org_ruleset_conditions;
  rules?: Array<repository_rule>;
  /**
   * @format date-time
   */
  created_at?: string;
  /**
   * @format date-time
   */
  updated_at?: string;
};
