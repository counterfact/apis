/**
 * @example {"audio_path":"audio/my_project.mp3","audio_url":"https://example.com/audio/my_project.mp3","author":"John Doe","background_color":"#FFFFFF","image":"https://example.com/image.jpg","sessionization":1,"small":false,"status":"ready","text_color":"#000000","title":"My Project"}
 */
export type AudioNativeProjectSettingsResponseModel = {
  /**
   * The title of the project.
   */
  title: string;
  /**
   * The image of the project.
   */
  image: string;
  /**
   * The author of the project.
   */
  author: string;
  /**
   * Whether the project is small.
   */
  small: boolean;
  /**
   * The text color of the project.
   */
  text_color: string;
  /**
   * The background color of the project.
   */
  background_color: string;
  /**
   * The sessionization of the project. Specifies for how many minutes to persist the session across page reloads.
   */
  sessionization: number;
  /**
   * The path of the audio file.
   */
  audio_path?: string | null;
  /**
   * The URL of the audio file.
   */
  audio_url?: string | null;
  /**
   * Current state of the project
   * @default "ready"
   */
  status?: "processing" | "ready";
};
