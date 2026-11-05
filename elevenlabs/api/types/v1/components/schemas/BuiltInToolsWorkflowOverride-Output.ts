import type { SystemToolConfig_Output } from "./SystemToolConfig-Output.js";
export type BuiltInToolsWorkflowOverride_Output = {
  /**
   * The transfer to agent tool
   */
  transfer_to_agent?: SystemToolConfig_Output | null;
  /**
   * The end call tool
   */
  end_call?: SystemToolConfig_Output | null;
  /**
   * The language detection tool
   */
  language_detection?: SystemToolConfig_Output | null;
  /**
   * The transfer to number tool
   */
  transfer_to_number?: SystemToolConfig_Output | null;
  /**
   * The skip turn tool
   */
  skip_turn?: SystemToolConfig_Output | null;
  /**
   * The play DTMF tool
   */
  play_keypad_touch_tone?: SystemToolConfig_Output | null;
  /**
   * The voicemail detection tool
   */
  voicemail_detection?: SystemToolConfig_Output | null;
};
