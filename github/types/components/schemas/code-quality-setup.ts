/**
 * Configuration for code quality setup.
 */
export type code_quality_setup = {
  /**
   * Code quality setup has been configured or not.
   */
  state?: "configured" | "not-configured";
  /**
   * Languages to be analyzed.
   */
  languages?: Array<
    | "csharp"
    | "go"
    | "java-kotlin"
    | "javascript-typescript"
    | "python"
    | "ruby"
    | "rust"
  >;
  /**
   * Runner type to be used.
   */
  runner_type?: "standard" | "labeled";
  /**
   * Runner label to be used if the runner type is labeled.
   * @example "code-scanning"
   */
  runner_label?: string;
  /**
   * Timestamp of latest configuration update.
   * @format date-time
   * @example "2023-12-06T14:20:20.000Z"
   */
  updated_at?: string;
  /**
   * The frequency of the periodic analysis.
   */
  schedule?: "weekly";
};
