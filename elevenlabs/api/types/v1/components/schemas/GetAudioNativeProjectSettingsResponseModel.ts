import type { AudioNativeProjectSettingsResponseModel } from "./AudioNativeProjectSettingsResponseModel.js";
/**
 * @example {"enabled":true,"settings":{"audio_path":"audio/my_project.mp3","audio_url":"https://example.com/audio/my_project.mp3","author":"John Doe","background_color":"#FFFFFF","image":"https://example.com/image.jpg","sessionization":1,"small":false,"status":"ready","text_color":"#000000","title":"My Project"},"snapshot_id":"JBFqnCBsd6RMkjVDRZzb"}
 */
export type GetAudioNativeProjectSettingsResponseModel = {
  /**
   * Whether the project is enabled.
   */
  enabled: boolean;
  /**
   * The ID of the latest snapshot of the project.
   */
  snapshot_id?: string | null;
  /**
   * The settings of the project.
   */
  settings?: AudioNativeProjectSettingsResponseModel | null;
};
