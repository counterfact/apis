import type { TurnMode } from "./TurnMode.js";
import type { TurnEagerness } from "./TurnEagerness.js";
import type { SpellingPatience } from "./SpellingPatience.js";
import type { TurnModel } from "./TurnModel.js";
import type { SoftTimeoutConfigWorkflowOverride } from "./SoftTimeoutConfigWorkflowOverride.js";
/**
 * @example {"interruption_ignore_term_languages":[],"interruption_ignore_terms":[],"merge_with_default_ignore_terms":false,"mode":"turn","retranscribe_on_turn_timeout":false,"silence_end_call_timeout":-1,"soft_timeout_config":{"message":"Hhmmmm...yeah.","timeout_seconds":-1,"use_llm_generated_message":false},"speculative_turn":false,"spelling_patience":"auto","transcribe_on_disabled_interruptions":false,"turn_eagerness":"normal","turn_model":"turn_v3","turn_timeout":7}
 */
export type TurnConfigWorkflowOverride = {
  /**
   * Maximum wait time for the user's reply before re-engaging the user
   */
  turn_timeout?: number | null;
  /**
   * How long the agent will wait for the user to start the conversation if the first message is empty. If not set, uses the regular turn_timeout.
   */
  initial_wait_time?: number | null;
  /**
   * Maximum wait time since the user last spoke before terminating the call
   */
  silence_end_call_timeout?: number | null;
  /**
   * The mode of turn detection
   */
  mode?: TurnMode | null;
  /**
   * Controls how eager the agent is to respond. Low = less eager (waits longer), Standard = default eagerness, High = more eager (responds sooner)
   */
  turn_eagerness?: TurnEagerness | null;
  /**
   * Controls if the agent should be more patient when user is spelling numbers and named entities. Auto = model based, Off = never wait extra
   */
  spelling_patience?: SpellingPatience | null;
  /**
   * When enabled, starts generating LLM responses during silence before full turn confidence is reached, reducing perceived latency. May increase LLM costs.
   */
  speculative_turn?: boolean | null;
  /**
   * When enabled, if VAD detects no speech, attempts to re-transcribe accumulated audio at turn timeout. Disables silence discount billing while enabled for the active agent or workflow node.
   */
  retranscribe_on_turn_timeout?: boolean | null;
  /**
   * Version of the turn detection model to use.
   */
  turn_model?: TurnModel | null;
  /**
   * List of terms that should not trigger an interruption when spoken by the user (e.g. 'gotcha', 'understood'). Uses case-insensitive exact matching.
   */
  interruption_ignore_terms?: Array<string> | null;
  /**
   * Language codes for which preset ignore-term categories have been activated. Stored explicitly so display is not inferred from term overlap.
   */
  interruption_ignore_term_languages?: Array<string> | null;
  /**
   * When enabled, the curated default terms for interruption_ignore_term_languages are used in addition to interruption_ignore_terms.
   */
  merge_with_default_ignore_terms?: boolean | null;
  /**
   * When interruptions are disabled, still transcribe what the user says so it can carry into the next turn. When off, user speech during a non-interruptible turn is ignored and won't trigger a turn.
   */
  transcribe_on_disabled_interruptions?: boolean | null;
  /**
   * Configuration for soft timeout functionality. Provides immediate feedback during longer LLM responses.
   */
  soft_timeout_config?: SoftTimeoutConfigWorkflowOverride | null;
  /**
   * What the agent says when it detects a noisy environment.
   */
  noisy_environment_message?: string | null;
};
