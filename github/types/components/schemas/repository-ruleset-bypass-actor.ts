/**
 * An actor that can bypass rules in a ruleset
 */
export type repository_ruleset_bypass_actor = {
  /**
   * The ID of the actor that can bypass a ruleset. Required for `Integration`, `RepositoryRole`, `Team`, and `User` actor types. If `actor_type` is `OrganizationAdmin`, `actor_id` is ignored. If `actor_type` is `DeployKey`, this should be null. `OrganizationAdmin` is not applicable for personal repositories.
   */
  actor_id?: number;
  /**
   * The type of actor that can bypass a ruleset.
   */
  actor_type:
    | "Integration"
    | "OrganizationAdmin"
    | "RepositoryRole"
    | "Team"
    | "DeployKey"
    | "User";
  /**
   * When the specified actor can bypass the ruleset. `pull_request` means that an actor can only bypass rules on pull requests. `pull_request` is not applicable for the `DeployKey` actor type. Also, `pull_request` is only applicable to branch rulesets. When `bypass_mode` is `exempt`, rules will not be run for that actor and a bypass audit entry will not be created.
   * @default "always"
   */
  bypass_mode?: "always" | "pull_request" | "exempt";
};
