/**
 * Usage metrics for Copilot for pull requests.
 */
export type copilot_dotcom_pull_requests = {
  /**
   * The number of users who used Copilot for Pull Requests on github.com to generate a pull request summary at least once.
   */
  total_engaged_users?: number;
  /**
   * Repositories in which users used Copilot for Pull Requests to generate pull request summaries
   */
  repositories?: Array<{
    /**
     * Repository name
     */
    name?: string;
    /**
     * The number of users who generated pull request summaries using Copilot for Pull Requests in the given repository.
     */
    total_engaged_users?: number;
    /**
     * List of model metrics for custom models and the default model.
     */
    models?: Array<{
      /**
       * Name of the model used for Copilot pull request summaries. If the default model is used will appear as 'default'.
       */
      name?: string;
      /**
       * Indicates whether a model is custom or default.
       */
      is_custom_model?: boolean;
      /**
       * The training date for the custom model.
       */
      custom_model_training_date?: string;
      /**
       * The number of pull request summaries generated using Copilot for Pull Requests in the given repository.
       */
      total_pr_summaries_created?: number;
      /**
       * The number of users who generated pull request summaries using Copilot for Pull Requests in the given repository and model.
       */
      total_engaged_users?: number;
    }>;
  }>;
  [key: string]: unknown;
};
