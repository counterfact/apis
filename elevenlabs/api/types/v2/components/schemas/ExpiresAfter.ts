export type ExpiresAfter = {
  /**
   * @default "created_at"
   */
  anchor?: "created_at";
  seconds: number;
};
