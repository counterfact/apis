import type { VOICE_CATEGORY } from "./VOICE_CATEGORY.js";
export type SimilarVoice = {
  voice_id: string;
  name: string;
  category: VOICE_CATEGORY;
  description?: string | null;
  preview_url?: string | null;
};
