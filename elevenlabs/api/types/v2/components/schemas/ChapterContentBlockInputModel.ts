import type { ChapterContentParagraphTtsNodeInputModel } from "./ChapterContentParagraphTtsNodeInputModel.js";
export type ChapterContentBlockInputModel = {
  sub_type?: ("p" | "h1" | "h2" | "h3") | null;
  nodes: Array<ChapterContentParagraphTtsNodeInputModel>;
  block_id?: string | null;
};
