import type { ProjectSnapshotResponseModel } from "./ProjectSnapshotResponseModel.js";
/**
 * @example {"snapshots":[{"created_at_unix":1714204800,"name":"My Project Snapshot","project_id":"aw1NgEzBg83R7vgmiJt6","project_snapshot_id":"aw1NgEzBg83R7vgmiJt6"}]}
 */
export type ProjectSnapshotsResponseModel = {
  /**
   * List of project snapshots.
   */
  snapshots: Array<ProjectSnapshotResponseModel>;
};
