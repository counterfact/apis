/**
 * Only allow users with bypass permission to update matching refs.
 */
export type repository_rule_update = {
  type: "update";
  parameters?: {
    /**
     * Branch can pull changes from its upstream repository
     */
    update_allows_fetch_and_merge: boolean;
  };
};
