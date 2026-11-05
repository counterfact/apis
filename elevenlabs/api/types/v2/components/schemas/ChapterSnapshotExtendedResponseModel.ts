import type { CharacterAlignmentModel } from "./CharacterAlignmentModel.js";
/**
 * @example {"chapter_id":"aw1NgEzBg83R7vgmiJt3","chapter_snapshot_id":"aw1NgEzBg83R7vgmiJt1","character_alignments":[],"created_at_unix":1714204800,"name":"My Chapter Snapshot","project_id":"aw1NgEzBg83R7vgmiJt2"}
 */
export type ChapterSnapshotExtendedResponseModel = {
  /**
   * The ID of the chapter snapshot.
   */
  chapter_snapshot_id: string;
  /**
   * The ID of the project.
   */
  project_id: string;
  /**
   * The ID of the chapter.
   */
  chapter_id: string;
  /**
   * The creation date of the chapter snapshot.
   */
  created_at_unix: number;
  /**
   * The name of the chapter snapshot.
   */
  name: string;
  character_alignments: Array<CharacterAlignmentModel>;
};
