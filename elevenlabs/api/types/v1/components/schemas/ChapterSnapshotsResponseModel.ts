import type { ChapterSnapshotResponseModel } from "./ChapterSnapshotResponseModel.js";
/**
 * @example {"snapshots":[{"chapter_id":"aw1NgEzBg83R7vgmiJt3","chapter_snapshot_id":"aw1NgEzBg83R7vgmiJt1","created_at_unix":1714204800,"name":"My Chapter Snapshot","project_id":"aw1NgEzBg83R7vgmiJt2"}]}
 */
export type ChapterSnapshotsResponseModel = {
  /**
   * List of chapter snapshots.
   */
  snapshots: Array<ChapterSnapshotResponseModel>;
};
