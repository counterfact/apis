import type { WidgetTextContents } from "./WidgetTextContents.js";
import type { WidgetTextContentsTranslation } from "./WidgetTextContentsTranslation.js";
import type { WidgetTermsTranslation } from "./WidgetTermsTranslation.js";
export type WidgetLanguagePreset = {
  /**
   * The text contents for the selected language
   */
  text_contents?: WidgetTextContents | null;
  /**
   * The translation cache for the text contents
   */
  text_contents_translation?: WidgetTextContentsTranslation | null;
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
  /**
   * The translation cache for the terms
   */
  terms_translation?: WidgetTermsTranslation | null;
};
