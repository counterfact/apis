export type WidgetStyles = {
  /**
   * The base background color.
   */
  base?: string | null;
  /**
   * The color of the base background when hovered.
   */
  base_hover?: string | null;
  /**
   * The color of the base background when active (clicked).
   */
  base_active?: string | null;
  /**
   * The color of the border against the base background.
   */
  base_border?: string | null;
  /**
   * The color of subtle text against the base background.
   */
  base_subtle?: string | null;
  /**
   * The color of primary text against the base background.
   */
  base_primary?: string | null;
  /**
   * The color of error text against the base background.
   */
  base_error?: string | null;
  /**
   * The accent background color.
   */
  accent?: string | null;
  /**
   * The color of the accent background when hovered.
   */
  accent_hover?: string | null;
  /**
   * The color of the accent background when active (clicked).
   */
  accent_active?: string | null;
  /**
   * The color of the border against the accent background.
   */
  accent_border?: string | null;
  /**
   * The color of subtle text against the accent background.
   */
  accent_subtle?: string | null;
  /**
   * The color of primary text against the accent background.
   */
  accent_primary?: string | null;
  /**
   * The padding around the edges of the viewport.
   */
  overlay_padding?: number | null;
  /**
   * The radius of the buttons.
   */
  button_radius?: number | null;
  /**
   * The radius of the input fields.
   */
  input_radius?: number | null;
  /**
   * The radius of the chat bubbles.
   */
  bubble_radius?: number | null;
  /**
   * The default radius of sheets.
   */
  sheet_radius?: number | null;
  /**
   * The radius of the sheet in compact mode.
   */
  compact_sheet_radius?: number | null;
  /**
   * The radius of the dropdown sheet.
   */
  dropdown_sheet_radius?: number | null;
};
