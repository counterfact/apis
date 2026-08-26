export type PostInsightGroupParams = {
  /**
   * The name of the insight group
   * @example "Production - All Apps"
   */
  name: string;
  /**
   * The key of the insight group
   * @example "default-production-all-apps"
   */
  key: string;
  /**
   * The projectKey to be associated with the insight group
   * @example "default"
   */
  projectKey: string;
  /**
   * The environmentKey to be associated with the insight group
   * @example "production"
   */
  environmentKey: string;
  /**
   * The application keys to associate with the insight group. If not provided, the insight group will include data from all applications.
   * @example ["billing-service","inventory-service"]
   */
  applicationKeys?: Array<string>;
};
