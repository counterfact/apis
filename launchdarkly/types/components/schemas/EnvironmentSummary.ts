export type EnvironmentSummary = {
  /**
   * The location and content type of related resources
   * @example {"self":{"href":"/api/v2/projects/my-project/environments/my-environment","type":"application/json"}}
   */
  _links: { [key: string]: unknown };
  /**
   * A project-unique key for the environment
   * @example "environment-key-123abc"
   */
  key: string;
  /**
   * A human-friendly name for the environment
   * @example "My Environment"
   */
  name: string;
  /**
   * The color used to indicate this environment in the UI
   * @example "F5A623"
   */
  color: string;
};
