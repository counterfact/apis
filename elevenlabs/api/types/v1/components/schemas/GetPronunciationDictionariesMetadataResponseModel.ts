import type { GetPronunciationDictionaryMetadataResponseModel } from "./GetPronunciationDictionaryMetadataResponseModel.js";
/**
 * @example {"has_more":false,"next_cursor":"5xM3yVvZQKV0EfqQpLr2","pronunciation_dictionaries":[{"created_by":"ar6633Es2kUjFXBdR1iVc9ztsXl1","creation_time_unix":1714156800,"description":"This is a test dictionary","id":"5xM3yVvZQKV0EfqQpLrJ","latest_version_id":"5xM3yVvZQKV0EfqQpLr2","latest_version_rules_num":2,"name":"My Dictionary","permission_on_resource":"admin"}]}
 */
export type GetPronunciationDictionariesMetadataResponseModel = {
  /**
   * A list of pronunciation dictionaries and their metadata.
   */
  pronunciation_dictionaries: Array<GetPronunciationDictionaryMetadataResponseModel>;
  /**
   * The next cursor to use for pagination.
   */
  next_cursor?: string | null;
  /**
   * Whether there are more pronunciation dictionaries to fetch.
   */
  has_more: boolean;
};
