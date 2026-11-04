/**
 * Coordinates of a clip inside a Studio project: the payload of a studio_clip reference.
 */
export type StudioClipLocator = {
  project_id: string;
  chapter_id: string;
  clip_type: "video" | "image" | "external_audio" | "tts_node";
  clip_id: string;
  block_id?: string | null;
  preview_url?: string | null;
};
