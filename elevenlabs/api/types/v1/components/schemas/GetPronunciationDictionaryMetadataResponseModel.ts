/**
 * @example {"created_by":"ar6633Es2kUjFXBdR1iVc9ztsXl1","creation_time_unix":1714156800,"description":"This is a test dictionary","id":"5xM3yVvZQKV0EfqQpLrJ","latest_version_id":"5xM3yVvZQKV0EfqQpLr2","latest_version_rules_num":2,"name":"My Dictionary","permission_on_resource":"admin"}
 */
export type GetPronunciationDictionaryMetadataResponseModel = {
  /**
   * The ID of the pronunciation dictionary.
   */
  id: string;
  /**
   * The ID of the latest version of the pronunciation dictionary.
   */
  latest_version_id: string;
  /**
   * The number of rules in the latest version of the pronunciation dictionary.
   */
  latest_version_rules_num: number;
  /**
   * The name of the pronunciation dictionary.
   */
  name: string;
  /**
   * The permission on the resource of the pronunciation dictionary.
   */
  permission_on_resource: ("admin" | "editor" | "commenter" | "viewer") | null;
  /**
   * The user ID of the creator of the pronunciation dictionary.
   */
  created_by: string;
  /**
   * The creation time of the pronunciation dictionary in Unix timestamp.
   */
  creation_time_unix: number;
  /**
   * The archive time of the pronunciation dictionary in Unix timestamp.
   */
  archived_time_unix?: number | null;
  /**
   * The description of the pronunciation dictionary.
   */
  description?: string | null;
};
