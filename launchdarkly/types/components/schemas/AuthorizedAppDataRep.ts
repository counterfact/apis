export type AuthorizedAppDataRep = {
  _links?: { [key: string]: unknown };
  /**
   * The ID of the authorized application
   */
  _id?: string;
  /**
   * Whether the application is authorized through SCIM
   */
  isScim?: boolean;
  /**
   * The authorized application name
   */
  name?: string;
  /**
   * The name of the maintainer for this authorized application
   */
  maintainerName?: string;
};
