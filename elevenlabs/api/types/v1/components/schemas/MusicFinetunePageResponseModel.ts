import type { MusicFinetuneResponseModel } from "./MusicFinetuneResponseModel.js";
export type MusicFinetunePageResponseModel = {
  /**
   * The finetunes in this page.
   */
  finetunes: Array<MusicFinetuneResponseModel>;
  /**
   * Cursor to pass as `cursor` to fetch the next page; `null` when there are no more results.
   */
  next_cursor: string | null;
  /**
   * Whether more finetunes are available beyond this page.
   */
  has_more: boolean;
};
