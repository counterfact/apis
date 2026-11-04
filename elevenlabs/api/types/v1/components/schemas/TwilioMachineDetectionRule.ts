import type { TwilioMachineDetectionAction } from "./TwilioMachineDetectionAction.js";
import type { TwilioAnsweredBy } from "./TwilioAnsweredBy.js";
/**
 * Action to take on a live call for the given AMD verdicts.
 */
export type TwilioMachineDetectionRule = {
  action: TwilioMachineDetectionAction;
  /**
   * Verdicts that trigger the action.
   */
  answered_by: Array<TwilioAnsweredBy>;
};
