import type { SystemToolConfig_Input } from "./SystemToolConfig-Input.js";
/**
 * System tools a conversational agent can be given.
 *
 * Deliberately not named ConversationalBuiltInTools: BuiltInToolsInput and
 * BuiltInToolsOutput are part of the public API spec and the generated SDKs.
 */
export type BuiltInTools_Input = {
  /**
   * The transfer to agent tool
   */
  transfer_to_agent?: SystemToolConfig_Input | null;
  /**
   * The end call tool
   */
  end_call?: SystemToolConfig_Input | null;
  /**
   * The language detection tool
   */
  language_detection?: SystemToolConfig_Input | null;
  /**
   * The transfer to number tool
   */
  transfer_to_number?: SystemToolConfig_Input | null;
  /**
   * The skip turn tool
   */
  skip_turn?: SystemToolConfig_Input | null;
  /**
   * The play DTMF tool
   */
  play_keypad_touch_tone?: SystemToolConfig_Input | null;
  /**
   * The voicemail detection tool
   */
  voicemail_detection?: SystemToolConfig_Input | null;
};
