export type UpsertContextKindPayload = {
  /**
   * The context kind name
   * @example "organization"
   */
  name: string;
  /**
   * The context kind description
   * @example "An example context kind for organizations"
   */
  description?: string;
  /**
   * Alias for archived.
   * @example false
   */
  hideInTargeting?: boolean;
  /**
   * Whether the context kind is archived. Archived context kinds are unavailable for targeting.
   * @example false
   */
  archived?: boolean;
  /**
   * The context kind version. If not specified when the context kind is created, defaults to 1.
   * @example 1
   */
  version?: number;
};
