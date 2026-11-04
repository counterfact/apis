import type { TranslatedString } from "./TranslatedString.js";
export type SayNodeLiteralMessage_Input = {
  /**
   * @default "literal"
   */
  type?: "literal";
  /**
   * Literal text message to be spoken by the agent.
   */
  text: string;
  /**
   * Translations for the text field
   */
  text_translations?: { [key: string]: TranslatedString };
};
