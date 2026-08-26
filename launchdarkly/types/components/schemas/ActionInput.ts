export type ActionInput = {
  /**
   * An array of instructions for the stage. Each object in the array uses the semantic patch format for updating a feature flag.
   * @example "{\"instructions\": [{ \"kind\": \"turnFlagOn\"}]}"
   */
  instructions?: unknown;
};
