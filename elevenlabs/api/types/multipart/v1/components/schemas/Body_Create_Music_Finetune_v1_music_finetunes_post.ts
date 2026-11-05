import type { MultipartFile } from "../../../../../counterfact-types/index.ts";
import type { MusicModelID } from "./MusicModelID.js";
export type Body_Create_Music_Finetune_v1_music_finetunes_post = {
  /**
   * Name for the finetune (5-200 characters).
   */
  name: string;
  /**
   * Primary musical genre of the finetune.
   */
  primary_genre: string;
  /**
   * Audio files to train on.
   * @default []
   */
  files?: Array<MultipartFile>;
  /**
   * Tags to associate with the finetune.
   * @default []
   */
  tags?: Array<string>;
  /**
   * Finetune visibility. Only 'private' and 'workspace' can be set.
   */
  visibility?: ("private" | "workspace") | null;
  /**
   * The model to create a finetune for.
   * @default "music_v1"
   */
  model_id?: MusicModelID;
};
