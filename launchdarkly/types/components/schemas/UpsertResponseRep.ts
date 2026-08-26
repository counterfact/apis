export type UpsertResponseRep = {
  /**
   * The status of the create or update operation
   * @example "success"
   */
  status?: string;
  /**
   * The location and content type of related resources
   */
  _links?: { [key: string]: unknown };
};
