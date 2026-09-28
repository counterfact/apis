import type { TreatmentResultRep } from "./TreatmentResultRep.js";

export type SlicedResultsRep = {
  /**
   * An attribute that results are sliced by
   * @example "country"
   */
  attribute?: string;
  /**
   * Attribute Value for 'attribute'
   * @example "Canada"
   */
  attributeValue?: string;
  /**
   * A list of the results for each treatment
   */
  treatmentResults?: Array<TreatmentResultRep>;
};
