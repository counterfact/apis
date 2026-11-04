/**
 * @example {"converting":false,"html_snippet":"<div id='audio-native-player'></div>","project_id":"JBFqnCBsd6RMkjVDRZzb","publishing":false}
 */
export type AudioNativeEditContentResponseModel = {
  /**
   * The ID of the project.
   */
  project_id: string;
  /**
   * Whether the project is currently being converted.
   */
  converting: boolean;
  /**
   * Whether the project is currently being published.
   */
  publishing: boolean;
  /**
   * The HTML snippet to embed the Audio Native player.
   */
  html_snippet: string;
};
