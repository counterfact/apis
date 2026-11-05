/**
 * @example {"created_at_unix":1714204800,"name":"My Project Snapshot","project_id":"aw1NgEzBg83R7vgmiJt6","project_snapshot_id":"aw1NgEzBg83R7vgmiJt6"}
 */
export type ProjectSnapshotResponseModel = {
  /**
   * The ID of the project snapshot.
   */
  project_snapshot_id: string;
  /**
   * The ID of the project.
   */
  project_id: string;
  /**
   * The creation date of the project snapshot.
   */
  created_at_unix: number;
  /**
   * The name of the project snapshot.
   */
  name: string;
  /**
   * (Deprecated)
   */
  audio_upload?: { [key: string]: unknown } | null;
  /**
   * (Deprecated)
   */
  zip_upload?: { [key: string]: unknown } | null;
};
