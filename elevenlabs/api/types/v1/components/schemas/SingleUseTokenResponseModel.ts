/**
 * @example {"token":"sutkn_1234567890"}
 */
export type SingleUseTokenResponseModel = {
  /**
   * A time bound single use token that expires after 15 minutes. Will be consumed on use.
   */
  token: string;
};
