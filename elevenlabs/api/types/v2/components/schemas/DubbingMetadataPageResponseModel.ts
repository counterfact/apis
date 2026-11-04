import type { DubbingMetadataResponse } from "./DubbingMetadataResponse.js";
export type DubbingMetadataPageResponseModel = {
  dubs: Array<DubbingMetadataResponse>;
  next_cursor: string | null;
  has_more: boolean;
};
