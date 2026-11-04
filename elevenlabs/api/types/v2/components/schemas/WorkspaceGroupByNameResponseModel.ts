/**
 * @example {"id":"1234567890","members_emails":["john.doe@example.com","jane.smith@example.com"],"name":"My Workspace Group"}
 */
export type WorkspaceGroupByNameResponseModel = {
  /**
   * The name of the workspace group.
   */
  name: string;
  /**
   * The ID of the workspace group.
   */
  id: string;
  /**
   * The emails of the members of the workspace group.
   */
  members_emails: Array<string>;
};
