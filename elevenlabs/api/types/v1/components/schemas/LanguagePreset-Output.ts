import type { ConversationConfigClientOverride_Output } from "./ConversationConfigClientOverride-Output.js";
import type { LanguagePresetTranslation } from "./LanguagePresetTranslation.js";
export type LanguagePreset_Output = {
  /**
   * The overrides for the language preset
   */
  overrides: ConversationConfigClientOverride_Output;
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
