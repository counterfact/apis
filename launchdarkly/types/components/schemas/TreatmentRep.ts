import type { ParameterRep } from "./ParameterRep.js";

export type TreatmentRep = {
  /**
   * The treatment ID. This is the variation ID from the flag.
   * @example "122c9f3e-da26-4321-ba68-e0fc02eced58"
   */
  _id?: string;
  /**
   * The treatment name. This is the variation name from the flag.
   * @example "Treatment 1"
   */
  name: string;
  /**
   * The percentage of traffic allocated to this treatment during the iteration
   * @example "10"
   */
  allocationPercent: string;
  /**
   * Whether this treatment is the baseline to compare other treatments against
   * @example true
   */
  baseline?: boolean;
  /**
   * Details on the flag and variation used for this treatment
   */
  parameters?: Array<ParameterRep>;
};
