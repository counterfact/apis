export type RateLimitedErrorRep = {
  /**
   * Specific error code encountered
   * @example "rate_limited"
   */
  code: string;
  /**
   * Description of the error
   * @example "You've exceeded the API rate limit. Try again later."
   */
  message: string;
};
