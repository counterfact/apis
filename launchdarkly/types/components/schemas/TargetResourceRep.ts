export type TargetResourceRep = {
  _links?: { [key: string]: unknown };
  /**
   * The name of the resource
   * @example "Example flag name"
   */
  name?: string;
  /**
   * The resource specifier
   * @example ["proj/example-project:env/production:flag/example-flag"]
   */
  resources?: Array<string>;
};
