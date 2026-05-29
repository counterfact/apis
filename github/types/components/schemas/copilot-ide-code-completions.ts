/**
 * Usage metrics for Copilot editor code completions in the IDE.
 */
export type copilot_ide_code_completions = {
  /**
   * Number of users who accepted at least one Copilot code suggestion, across all active editors. Includes both full and partial acceptances.
   */
  total_engaged_users?: number;
  /**
   * Code completion metrics for active languages.
   */
  languages?: Array<{
    /**
     * Name of the language used for Copilot code completion suggestions.
     */
    name?: string;
    /**
     * Number of users who accepted at least one Copilot code completion suggestion for the given language. Includes both full and partial acceptances.
     */
    total_engaged_users?: number;
  }>;
  editors?: Array<{
    /**
     * Name of the given editor.
     */
    name?: string;
    /**
     * Number of users who accepted at least one Copilot code completion suggestion for the given editor. Includes both full and partial acceptances.
     */
    total_engaged_users?: number;
    /**
     * List of model metrics for custom models and the default model.
     */
    models?: Array<{
      /**
       * Name of the model used for Copilot code completion suggestions. If the default model is used will appear as 'default'.
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
       * Number of users who accepted at least one Copilot code completion suggestion for the given editor, for the given language and model. Includes both full and partial acceptances.
       */
      total_engaged_users?: number;
      /**
       * Code completion metrics for active languages, for the given editor.
       */
      languages?: Array<{
        /**
         * Name of the language used for Copilot code completion suggestions, for the given editor.
         */
        name?: string;
        /**
         * Number of users who accepted at least one Copilot code completion suggestion for the given editor, for the given language. Includes both full and partial acceptances.
         */
        total_engaged_users?: number;
        /**
         * The number of Copilot code suggestions generated for the given editor, for the given language.
         */
        total_code_suggestions?: number;
        /**
         * The number of Copilot code suggestions accepted for the given editor, for the given language. Includes both full and partial acceptances.
         */
        total_code_acceptances?: number;
        /**
         * The number of lines of code suggested by Copilot code completions for the given editor, for the given language.
         */
        total_code_lines_suggested?: number;
        /**
         * The number of lines of code accepted from Copilot code suggestions for the given editor, for the given language.
         */
        total_code_lines_accepted?: number;
      }>;
    }>;
    [key: string]: unknown;
  }>;
  [key: string]: unknown;
};
