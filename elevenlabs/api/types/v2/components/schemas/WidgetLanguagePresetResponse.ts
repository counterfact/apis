import type { WidgetTextContents } from "./WidgetTextContents.js";
export type WidgetLanguagePresetResponse = {
  first_message?: string | null;
  /**
   * The text contents for the selected language
   */
  text_contents?: WidgetTextContents | null;
  /**
   * The text to display for terms and conditions in this language
   */
  terms_text?: string | null;
  /**
   * The HTML to display for terms and conditions in this language
   */
  terms_html?: string | null;
  /**
   * The key to display for terms and conditions in this language
   */
  terms_key?: string | null;
};
