export type FlagReferenceRep = {
  /**
   * The project key
   * @example "default"
   */
  projectKey: string;
  /**
   * The flag key
   * @example "enable-new-payment-structure"
   */
  flagKey: string;
  /**
   * The number of references added
   * @example 2
   */
  referencesAdded: number;
  /**
   * The number of references removed
   * @example 5
   */
  referencesRemoved: number;
};
