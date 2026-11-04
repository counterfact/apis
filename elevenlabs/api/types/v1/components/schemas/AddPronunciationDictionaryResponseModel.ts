/**
 * @example {"created_by":"ar6633Es2kUjFXBdR1iVc9ztsXl1","creation_time_unix":1714156800,"description":"This is a test dictionary","id":"5xM3yVvZQKV0EfqQpLrJ","name":"My Dictionary","permission_on_resource":"admin","version_id":"5xM3yVvZQKV0EfqQpLrJ","version_rules_num":5}
 */
export type AddPronunciationDictionaryResponseModel = {
  /**
   * The ID of the created pronunciation dictionary.
   */
  id: string;
  /**
   * The name of the created pronunciation dictionary.
   */
  name: string;
  /**
   * The user ID of the creator of the pronunciation dictionary.
   */
  created_by: string;
  /**
   * The creation time of the pronunciation dictionary in Unix timestamp.
   */
  creation_time_unix: number;
  /**
   * The ID of the created pronunciation dictionary version.
   */
  version_id: string;
  /**
   * The number of rules in the version of the pronunciation dictionary.
   */
  version_rules_num: number;
  /**
   * The description of the pronunciation dictionary.
   */
  description?: string | null;
  /**
   * The permission on the resource of the pronunciation dictionary.
   */
  permission_on_resource: ("admin" | "editor" | "commenter" | "viewer") | null;
};
