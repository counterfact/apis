export type MaintainerTeam = {
  /**
   * The key of the maintainer team
   * @example "team-key-123abc"
   */
  key: string;
  /**
   * A human-friendly name for the maintainer team
   * @example "Example team"
   */
  name: string;
  /**
   * The location and content type of related resources
   * @example {"parent":{"href":"/api/v2/teams","type":"application/json"},"roles":{"href":"/api/v2/teams/example-team/roles","type":"application/json"},"self":{"href":"/api/v2/teams/example-team","type":"application/json"}}
   */
  _links?: { [key: string]: unknown };
};
