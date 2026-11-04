import type { TwilioMachineDetectionMode } from "./TwilioMachineDetectionMode.js";
import type { TwilioMachineDetectionRule } from "./TwilioMachineDetectionRule.js";
/**
 * How to run Twilio's carrier-level answering machine detection (AMD) on a call.
 */
export type TwilioMachineDetectionConfig = {
  /**
   * How thorough the detection should be. `enable` returns a verdict as soon as Twilio can tell a human from a machine. `detect_message_end` also waits for the voicemail greeting to finish, which is what produces the `machine_end_*` verdicts, but returns a result later.
   * @default "enable"
   */
  mode?: TwilioMachineDetectionMode;
  /**
   * Actions to take on the call per AMD verdict. Each action can appear in at most one rule, so list all of its verdicts together. Verdicts without a rule leave the call running.
   */
  actions?: Array<TwilioMachineDetectionRule>;
};
