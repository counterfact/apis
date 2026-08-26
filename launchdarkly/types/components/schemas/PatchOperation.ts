export type PatchOperation = {
  /**
   * The type of operation to perform
   * @example "replace"
   */
  op: string;
  /**
   * A JSON Pointer string specifying the part of the document to operate on
   * @example "/exampleField"
   */
  path: string;
  /**
   * A JSON value used in "add", "replace", and "test" operations
   * @example "new example value"
   */
  value: unknown;
};
