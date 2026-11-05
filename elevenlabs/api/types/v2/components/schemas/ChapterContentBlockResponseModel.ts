import type { ChapterContentBlockTtsNodeResponseModel } from "./ChapterContentBlockTtsNodeResponseModel.js";
import type { ChapterContentBlockExtendableNodeResponseModel } from "./ChapterContentBlockExtendableNodeResponseModel.js";
export type ChapterContentBlockResponseModel = {
  block_id: string;
  nodes: Array<
    | ChapterContentBlockTtsNodeResponseModel
    | ChapterContentBlockExtendableNodeResponseModel
  >;
};
