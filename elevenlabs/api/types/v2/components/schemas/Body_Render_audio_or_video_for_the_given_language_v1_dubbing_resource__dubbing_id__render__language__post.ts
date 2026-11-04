import type { RenderType } from "./RenderType.js";
export type Body_Render_audio_or_video_for_the_given_language_v1_dubbing_resource__dubbing_id__render__language__post =
  {
    /**
     * The type of the render. One of ['mp4', 'aac', 'mp3', 'wav', 'aaf', 'tracks_zip', 'clips_zip']
     */
    render_type: RenderType;
    /**
     * Whether to normalize the volume of the rendered audio.
     * @default false
     */
    normalize_volume?: boolean | null;
  };
