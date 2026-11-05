export type Body_Set_workspace_Third_Party_Disabling_policy_v1_workspaces_api_keys_third_party_disabling_post =
  {
    /**
     * `true` forces every key in the workspace to be disable-able by its holder; `false` forbids it for every key; `null` clears the override (per-key values and the plan default apply).
     */
    third_party_disable_allowed?: boolean | null;
  };
