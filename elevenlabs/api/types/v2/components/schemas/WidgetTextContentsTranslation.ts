export type WidgetTextContentsTranslation = {
  /**
   * The source text each translated field was derived from
   */
  source?: { [key: string]: string };
  /**
   * The last auto-translated output for each translated field
   */
  text?: { [key: string]: string };
};
