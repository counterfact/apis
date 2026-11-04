export type LanguageDetectionToolConfig = {
  /**
   * @default "language_detection"
   */
  system_tool_type?: "language_detection";
  /**
   * If no language switch happens in the first 2 user turns, later attempts fail and the conversation stays in the current language. If the language switches during those turns, later switching stays available. Enable to reduce the possibility of false switching.
   * @default false
   */
  only_at_conversation_start?: boolean;
};
