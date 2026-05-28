/**
 * Usage metrics for Copilot Chat in the IDE.
 */
export type copilot_ide_chat = {
  /**
   * Total number of users who prompted Copilot Chat in the IDE.
   */
  total_engaged_users?: number;
  editors?: Array<{
    /**
     * Name of the given editor.
     */
    name?: string;
    /**
     * The number of users who prompted Copilot Chat in the specified editor.
     */
    total_engaged_users?: number;
    /**
     * List of model metrics for custom models and the default model.
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
       * The training date for the custom model.
       */
      custom_model_training_date?: string;
      /**
       * The number of users who prompted Copilot Chat in the given editor and model.
       */
      total_engaged_users?: number;
      /**
       * The total number of chats initiated by users in the given editor and model.
       */
      total_chats?: number;
      /**
       * The number of times users accepted a code suggestion from Copilot Chat using the 'Insert Code' UI element, for the given editor.
       */
      total_chat_insertion_events?: number;
      /**
       * The number of times users copied a code suggestion from Copilot Chat using the keyboard, or the 'Copy' UI element, for the given editor.
       */
      total_chat_copy_events?: number;
    }>;
  }>;
  [key: string]: unknown;
};
