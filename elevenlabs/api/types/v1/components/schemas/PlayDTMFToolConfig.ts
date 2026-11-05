/**
 * Allows the agent to play DTMF tones during a phone call.
 *
 * This tool can be used to interact with automated phone systems, such as
 * navigating phone menus, entering extensions, or inputting numeric codes.
 */
export type PlayDTMFToolConfig = {
  /**
   * @default "play_keypad_touch_tone"
   */
  system_tool_type?: "play_keypad_touch_tone";
  /**
   * Send DTMF tones as out-of-band RTP events (RFC 4733) instead of in-band audio. Only effective for SIP trunk imported numbers.
   * @default true
   */
  use_out_of_band_dtmf?: boolean;
  /**
   * If true, the agent will not generate further speech after playing DTMF tones. This prevents the agent's speech from interfering with IVR systems.
   * @default false
   */
  suppress_turn_after_dtmf?: boolean;
};
