/**
 * Configuration for code scanning default setup.
 */
export type code_scanning_default_setup_update = {
  /**
   * The desired state of code scanning default setup.
   */
  state?: "configured" | "not-configured";
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
   * CodeQL languages to be analyzed.
   */
  languages?: Array<
    | "actions"
    | "c-cpp"
    | "csharp"
    | "go"
    | "java-kotlin"
    | "javascript-typescript"
    | "python"
    | "ruby"
    | "swift"
  >;
};
