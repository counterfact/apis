export type BulkEditMembersRep = {
  /**
   * A list of members IDs of the members who were successfully updated.
   * @example ["1234a56b7c89d012345e678f"]
   */
  members?: Array<string>;
  /**
   * A list of member IDs and errors for the members whose updates failed.
   * @example [{"507f1f77bcf86cd799439011":"you cannot modify your own role"}]
   */
  errors?: Array<{ [key: string]: string }>;
};
