/**
 * A list of errors found in a repo's CODEOWNERS file
 */
export type codeowners_errors = {
  errors: Array<{
    /**
     * The line number where this errors occurs.
     * @example 7
     */
    line: number;
    /**
     * The column number where this errors occurs.
     * @example 3
     */
    column: number;
    /**
     * The contents of the line where the error occurs.
     * @example "* user"
     */
    source?: string;
    /**
     * The type of error.
     * @example "Invalid owner"
     */
    kind: string;
    /**
     * Suggested action to fix the error. This will usually be `null`, but is provided for some common errors.
     * @example "The pattern `/` will never match anything, did you mean `*` instead?"
     */
    suggestion?: string;
    /**
     * A human-readable description of the error, combining information from multiple fields, laid out for display in a monospaced typeface (for example, a command-line setting).
     * @example "Invalid owner on line 7:\n\n  * user\n    ^"
     */
    message: string;
    /**
     * The path of the file where the error occured.
     * @example ".github/CODEOWNERS"
     */
    path: string;
  }>;
};
