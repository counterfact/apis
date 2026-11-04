import type { TurnMode } from "./TurnMode.js";
import type { TurnEagerness } from "./TurnEagerness.js";
import type { SpellingPatience } from "./SpellingPatience.js";
import type { TurnModel } from "./TurnModel.js";
/**
 * @example {"interruption_ignore_term_languages":[],"interruption_ignore_terms":[],"merge_with_default_ignore_terms":false,"mode":"turn","retranscribe_on_turn_timeout":false,"silence_end_call_timeout":-1,"speculative_turn":false,"spelling_patience":"auto","transcribe_on_disabled_interruptions":false,"turn_eagerness":"normal","turn_timeout":7}
 */
export type BaseTurnConfig = {
  /**
   * Maximum wait time for the user's reply before re-engaging the user
   * @default 7
   */
  turn_timeout?: number;
  /**
   * How long the agent will wait for the user to start the conversation if the first message is empty. If not set, uses the regular turn_timeout.
   */
  initial_wait_time?: number | null;
  /**
   * Maximum wait time since the user last spoke before terminating the call
   * @default -1
   */
  silence_end_call_timeout?: number;
  /**
   * The mode of turn detection
   * @default "turn"
   */
  mode?: TurnMode;
  /**
   * Controls how eager the agent is to respond. Low = less eager (waits longer), Standard = default eagerness, High = more eager (responds sooner)
   * @default "normal"
   */
  turn_eagerness?: TurnEagerness;
  /**
   * Controls if the agent should be more patient when user is spelling numbers and named entities. Auto = model based, Off = never wait extra
   * @default "auto"
   */
  spelling_patience?: SpellingPatience;
  /**
   * When enabled, starts generating LLM responses during silence before full turn confidence is reached, reducing perceived latency. May increase LLM costs.
   * @default false
   */
  speculative_turn?: boolean;
  /**
   * When enabled, if VAD detects no speech, attempts to re-transcribe accumulated audio at turn timeout. Disables silence discount billing while enabled for the active agent or workflow node.
   * @default false
   */
  retranscribe_on_turn_timeout?: boolean;
  /**
   * @default "turn_v3"
   */
  turn_model?: TurnModel;
  /**
   * List of terms that should not trigger an interruption when spoken by the user (e.g. 'gotcha', 'understood'). Uses case-insensitive exact matching.
   */
  interruption_ignore_terms?: Array<string>;
  /**
   * Language codes for which preset ignore-term categories have been activated. Stored explicitly so display is not inferred from term overlap.
   */
  interruption_ignore_term_languages?: Array<string>;
  /**
   * When enabled, the curated default terms for interruption_ignore_term_languages are used in addition to interruption_ignore_terms.
   * @default false
   */
  merge_with_default_ignore_terms?: boolean;
  /**
   * When interruptions are disabled, still transcribe what the user says so it can carry into the next turn. When off, user speech during a non-interruptible turn is ignored and won't trigger a turn.
   * @default false
   */
  transcribe_on_disabled_interruptions?: boolean;
};
