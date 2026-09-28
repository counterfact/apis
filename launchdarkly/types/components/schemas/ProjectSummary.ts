export type ProjectSummary = {
  /**
   * The ID of this project
   * @example "57be1db38b75bf0772d11383"
   */
  _id: string;
  /**
   * The location and content type of related resources
   * @example {"environments":{"href":"/api/v2/projects/example-project/environments","type":"application/json"},"self":{"href":"/api/v2/projects/example-project","type":"application/json"}}
   */
  _links: { [key: string]: unknown };
  /**
   * The project key
   * @example "project-key-123abc"
   */
  key: string;
  /**
   * The project name
   * @example "Example project"
   */
  name: string;
};
