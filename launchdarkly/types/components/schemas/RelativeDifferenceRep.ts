export type RelativeDifferenceRep = {
  /**
   * An upper bound of the relative difference between the treatment and the <code>fromTreatmentId</code>
   * @example 0.42655970355712425
   */
  upper?: number;
  /**
   * A lower bound of the relative difference between the treatment and the <code>fromTreatmentId</code>
   * @example -0.13708601934659803
   */
  lower?: number;
  /**
   * The treatment ID of the treatment against which the relative difference is calculated
   * @example "92b8354e-360e-4d67-8f13-fa6a46ca8077"
   */
  fromTreatmentId?: string;
};
