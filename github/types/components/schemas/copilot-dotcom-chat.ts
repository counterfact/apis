/**
 * Usage metrics for Copilot Chat in GitHub.com
 */
export type copilot_dotcom_chat = {
  /**
   * Total number of users who prompted Copilot Chat on github.com at least once.
   */
  total_engaged_users?: number;
  /**
   * List of model metrics for a custom models and the default model.
   */
  models?: Array<{
    /**
     * Name of the model used for Copilot Chat. If the default model is used will appear as 'default'.
     */
    name?: string;
    /**
     * Indicates whether a model is custom or default.
     */
    is_custom_model?: boolean;
    /**
     * The training date for the custom model (if applicable).
     */
    custom_model_training_date?: string;
    /**
     * Total number of users who prompted Copilot Chat on github.com at least once for each model.
     */
    total_engaged_users?: number;
    /**
     * Total number of chats initiated by users on github.com.
     */
    total_chats?: number;
  }>;
  [key: string]: unknown;
};
