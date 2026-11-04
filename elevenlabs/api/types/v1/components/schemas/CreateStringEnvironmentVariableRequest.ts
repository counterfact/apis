export type CreateStringEnvironmentVariableRequest = {
  type: "string";
  /**
   * Unique label for the environment variable.
   */
  label: string;
  /**
   * Environment-specific values. Must include 'production' key.
   */
  values: { [key: string]: string };
};
