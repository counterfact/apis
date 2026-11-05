import type { ConversationConfigClientOverride_Input } from "./ConversationConfigClientOverride-Input.js";
import type { LanguagePresetTranslation } from "./LanguagePresetTranslation.js";
export type LanguagePreset_Input = {
  /**
   * The overrides for the language preset
   */
  overrides: ConversationConfigClientOverride_Input;
  /**
   * The translation of the first message
   */
  first_message_translation?: LanguagePresetTranslation | null;
  /**
   * The translation of the soft timeout message
   */
  soft_timeout_translation?: LanguagePresetTranslation | null;
  /**
   * The translation of the noisy environment message
   */
  noisy_environment_message_translation?: LanguagePresetTranslation | null;
};
