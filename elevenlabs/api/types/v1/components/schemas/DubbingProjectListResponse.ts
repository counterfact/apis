import type { DubbingProjectResponse } from "./DubbingProjectResponse.js";
export type DubbingProjectListResponse = {
  /**
   * The page of dubbing projects the caller can access.
   */
  projects: Array<DubbingProjectResponse>;
  /**
   * Opaque cursor to pass back as `cursor` for the next page, or null when there are no more results.
   */
  next_cursor?: string | null;
};
