/**
 * @example {"status":"ok"}
 */
export type DeleteWorkspaceGroupMemberResponseModel = {
  /**
   * The status of the workspace group member deletion request. If the request was successful, the status will be 'ok'. Otherwise an error message with status 500 will be returned.
   */
  status: string;
};
