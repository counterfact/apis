import type { EmbedVariant } from "./EmbedVariant.js";
import type { WidgetPlacement } from "./WidgetPlacement.js";
import type { WidgetExpandable } from "./WidgetExpandable.js";
import type { OrbAvatar } from "./OrbAvatar.js";
import type { URLAvatar } from "./URLAvatar.js";
import type { ImageAvatar } from "./ImageAvatar.js";
import type { WidgetFeedbackMode } from "./WidgetFeedbackMode.js";
import type { WidgetEndFeedbackConfig } from "./WidgetEndFeedbackConfig.js";
import type { AllowlistItem } from "./AllowlistItem.js";
import type { WidgetTextContents } from "./WidgetTextContents.js";
import type { WidgetStyles } from "./WidgetStyles.js";
import type { WidgetLanguagePreset } from "./WidgetLanguagePreset.js";
/**
 * @example {"custom_avatar_path":"https://example.com/avatar.png","language_selector":false}
 */
export type WidgetConfig_Output = {
  /**
   * The variant of the widget
   * @default "full"
   */
  variant?: EmbedVariant;
  /**
   * The placement of the widget on the screen
   * @default "bottom-right"
   */
  placement?: WidgetPlacement;
  /**
   * Whether the widget is expandable
   * @default "never"
   */
  expandable?: WidgetExpandable;
  /**
   * The avatar of the widget
   */
  avatar?: OrbAvatar | URLAvatar | ImageAvatar;
  /**
   * The feedback mode of the widget
   * @default "none"
   */
  feedback_mode?: WidgetFeedbackMode;
  /**
   * Configuration for feedback collected at the end of the conversation
   */
  end_feedback?: WidgetEndFeedbackConfig | null;
  /**
   * The background color of the widget
   * @default "#ffffff"
   */
  bg_color?: string;
  /**
   * The text color of the widget
   * @default "#000000"
   */
  text_color?: string;
  /**
   * The button color of the widget
   * @default "#000000"
   */
  btn_color?: string;
  /**
   * The button text color of the widget
   * @default "#ffffff"
   */
  btn_text_color?: string;
  /**
   * The border color of the widget
   * @default "#e1e1e1"
   */
  border_color?: string;
  /**
   * The focus color of the widget
   * @default "#000000"
   */
  focus_color?: string;
  /**
   * The border radius of the widget
   */
  border_radius?: number | null;
  /**
   * The button radius of the widget
   */
  btn_radius?: number | null;
  /**
   * The action text of the widget
   */
  action_text?: string | null;
  /**
   * The start call text of the widget
   */
  start_call_text?: string | null;
  /**
   * The end call text of the widget
   */
  end_call_text?: string | null;
  /**
   * The expand text of the widget
   */
  expand_text?: string | null;
  /**
   * The text to display when the agent is listening
   */
  listening_text?: string | null;
  /**
   * The text to display when the agent is speaking
   */
  speaking_text?: string | null;
  /**
   * The text to display when sharing
   */
  shareable_page_text?: string | null;
  /**
   * Whether to show terms and conditions on the shareable page
   * @default true
   */
  shareable_page_show_terms?: boolean;
  /**
   * The text to display for terms and conditions
   */
  terms_text?: string | null;
  /**
   * The HTML to display for terms and conditions
   */
  terms_html?: string | null;
  /**
   * The key to display for terms and conditions
   */
  terms_key?: string | null;
  /**
   * Whether to show the avatar when the widget is collapsed
   * @default false
   */
  show_avatar_when_collapsed?: boolean | null;
  /**
   * Whether to disable the banner
   * @default false
   */
  disable_banner?: boolean;
  /**
   * The override link for the widget
   */
  override_link?: string | null;
  /**
   * List of allowed hostnames for clickable markdown links. Use { hostname: '*' } to allow any domain. Empty means no links are allowed.
   */
  markdown_link_allowed_hosts?: Array<AllowlistItem>;
  /**
   * Whether to automatically include www. variants of allowed hosts
   * @default true
   */
  markdown_link_include_www?: boolean;
  /**
   * Whether to allow http:// in addition to https:// for allowed hosts
   * @default true
   */
  markdown_link_allow_http?: boolean;
  /**
   * Whether to enable mic muting
   * @default true
   */
  mic_muting_enabled?: boolean;
  /**
   * Whether the widget should show the conversation transcript as it goes on
   * @default true
   */
  transcript_enabled?: boolean;
  /**
   * Whether the user should be able to send text messages
   * @default true
   */
  text_input_enabled?: boolean;
  /**
   * Whether to enable the conversation mode toggle in the widget
   * @default false
   */
  conversation_mode_toggle_enabled?: boolean;
  /**
   * Whether the widget should be expanded by default
   * @default false
   */
  default_expanded?: boolean;
  /**
   * Whether the widget should always be expanded
   * @default false
   */
  always_expanded?: boolean;
  /**
   * Whether the widget can be dismissed by the user
   * @default false
   */
  dismissible?: boolean;
  /**
   * Whether to show agent working/done/error status during tool use
   * @default false
   */
  show_agent_status?: boolean;
  /**
   * Whether to show the conversation ID after disconnection.
   * @default true
   */
  show_conversation_id?: boolean;
  /**
   * Whether to strip audio markup from messages.
   * @default true
   */
  strip_audio_tags?: boolean;
  /**
   * Theme for code block syntax highlighting. Defaults to auto-detection by the widget when not set.
   */
  syntax_highlight_theme?: ("light" | "dark") | null;
  /**
   * Text contents of the widget
   */
  text_contents?: WidgetTextContents;
  /**
   * Styles for the widget
   */
  styles?: WidgetStyles;
  /**
   * Whether to show the resize button
   * @default true
   */
  show_resize_button?: boolean;
  /**
   * Whether to ask the user to confirm before ending a chat or call
   * @default false
   */
  end_confirmation_enabled?: boolean;
  /**
   * Whether the widget opens fullscreen on mobile
   * @default true
   */
  mobile_fullscreen?: boolean;
  /**
   * Whether voice call transcripts are revealed as the agent speaks
   * @default true
   */
  transcript_speech_sync_enabled?: boolean;
  /**
   * Whether to show the language selector
   * @default false
   */
  language_selector?: boolean;
  /**
   * Whether the widget can switch to text only mode
   * @default true
   */
  supports_text_only?: boolean;
  /**
   * The custom avatar path
   */
  custom_avatar_path?: string | null;
  /**
   * Language presets for the widget
   */
  language_presets?: { [key: string]: WidgetLanguagePreset };
};
