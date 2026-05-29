import type { repository_ruleset_conditions } from "./repository-ruleset-conditions.js";
import type { repository_ruleset_conditions_repository_name_target } from "./repository-ruleset-conditions-repository-name-target.js";
import type { repository_ruleset_conditions_repository_id_target } from "./repository-ruleset-conditions-repository-id-target.js";
import type { repository_ruleset_conditions_repository_property_target } from "./repository-ruleset-conditions-repository-property-target.js";

/**
 * Conditions for an organization ruleset.
 * The branch and tag rulesets conditions object should contain both `repository_name` and `ref_name` properties, or both `repository_id` and `ref_name` properties, or both `repository_property` and `ref_name` properties.
 * The push rulesets conditions object does not require the `ref_name` property.
 * For repository policy rulesets, the conditions object should only contain the `repository_name`, the `repository_id`, or the `repository_property`.
 */
export type org_ruleset_conditions =
  | (repository_ruleset_conditions &
      repository_ruleset_conditions_repository_name_target)
  | (repository_ruleset_conditions &
      repository_ruleset_conditions_repository_id_target)
  | (repository_ruleset_conditions &
      repository_ruleset_conditions_repository_property_target);
