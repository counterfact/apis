/**
 * @example {"converting":false,"html_snippet":"<div id='audio-native-player'></div>","project_id":"JBFqnCBsd6RMkjVDRZzb"}
 */
export type AudioNativeCreateProjectResponseModel = {
  /**
   * The ID of the created Audio Native project.
   */
  project_id: string;
  /**
   * Whether the project is currently being converted.
   */
  converting: boolean;
  /**
   * The HTML snippet to embed the Audio Native player.
   */
  html_snippet: string;
};
