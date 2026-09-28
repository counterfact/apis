import type { TreatmentParameterInput } from "./TreatmentParameterInput.js";

export type TreatmentInput = {
  /**
   * The treatment name
   * @example "Treatment 1"
   */
  name: string;
  /**
   * Whether this treatment is the baseline to compare other treatments against
   * @example true
   */
  baseline: boolean;
  /**
   * The percentage of traffic allocated to this treatment during the iteration
   * @example "10"
   */
  allocationPercent: string;
  /**
   * Details on the flag and variation to use for this treatment
   */
  parameters: Array<TreatmentParameterInput>;
};
