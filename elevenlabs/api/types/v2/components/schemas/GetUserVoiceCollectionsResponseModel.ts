import type { UserVoiceCollectionResponseModel } from "./UserVoiceCollectionResponseModel.js";
export type GetUserVoiceCollectionsResponseModel = {
  /**
   * The voice collections the caller can access, sorted by title.
   */
  collections: Array<UserVoiceCollectionResponseModel>;
};
