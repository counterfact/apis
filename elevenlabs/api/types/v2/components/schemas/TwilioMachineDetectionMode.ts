/**
 * Which Twilio answering-machine-detection (AMD) mode to request for a call.
 *
 * `enable` returns a verdict as soon as Twilio can tell a human from a machine.
 * `detect_message_end` additionally waits for the greeting to finish, which is what
 * distinguishes the `machine_end_*` verdicts, at the cost of a later result.
 * @default "enable"
 */
export type TwilioMachineDetectionMode = "enable" | "detect_message_end";
