export type UpdateAssetParams = {
  /**
   * @default "update_asset"
   */
  smb_tool_type?: "update_asset";
  /**
   * Whether to offer an available_hours timezone, set from the workspace's enable_per_resource_timezones.
   * @default false
   */
  per_resource_timezones?: boolean;
};
