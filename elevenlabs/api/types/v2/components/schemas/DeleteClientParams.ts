/**
 * Delete a client, cascading deletion of all their appointments first.
 */
export type DeleteClientParams = {
  /**
   * @default "delete_client"
   */
  smb_tool_type?: "delete_client";
};
