export type ParentResourceRep = {
  _links?: { [key: string]: unknown };
  /**
   * The name of the parent resource
   */
  name?: string;
  /**
   * The parent's resource specifier
   */
  resource?: string;
};
