/**
 * Platform limit with usage stored in Firestore. Example: credit usage tracked in Firestore.
 */
export type StoredUsagePlatformLimit = {
  limit?: number | null;
  /**
   * Current usage
   * @default 0
   */
  usage?: number;
};
