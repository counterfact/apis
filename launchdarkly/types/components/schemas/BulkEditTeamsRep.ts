export type BulkEditTeamsRep = {
  /**
   * A list of member IDs of the members who were added to the teams.
   * @example ["1234a56b7c89d012345e678f"]
   */
  memberIDs?: Array<string>;
  /**
   * A list of team keys of the teams that were successfully updated.
   * @example ["example-team-1"]
   */
  teamKeys?: Array<string>;
  /**
   * A list of team keys and errors for the teams whose updates failed.
   * @example [{"example-team-2":"example failure message"}]
   */
  errors?: Array<{ [key: string]: string }>;
};
