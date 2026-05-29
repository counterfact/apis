/**
 * Configuration for code scanning default setup.
 */
export type code_scanning_default_setup = {
  /**
   * Code scanning default setup has been configured or not.
   */
  state?: "configured" | "not-configured";
  /**
   * Languages to be analyzed.
   */
  languages?: Array<
    | "actions"
    | "c-cpp"
    | "csharp"
    | "go"
    | "java-kotlin"
    | "javascript-typescript"
    | "javascript"
    | "python"
    | "ruby"
    | "typescript"
    | "swift"
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
   * CodeQL query suite to be used.
   */
  query_suite?: "default" | "extended";
  /**
   * Threat model to be used for code scanning analysis. Use `remote` to analyze only network sources and `remote_and_local` to include local sources like filesystem access, command-line arguments, database reads, environment variable and standard input.
   */
  threat_model?: "remote" | "remote_and_local";
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
