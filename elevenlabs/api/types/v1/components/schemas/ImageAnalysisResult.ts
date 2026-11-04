import type { ImageSubject } from "./ImageSubject.js";
export type ImageAnalysisResult = {
  title: string;
  description: string;
  content_type?: string | null;
  mood_and_style?: string | null;
  composition_notes?: string | null;
  /**
   * Readable text overlaid or shown in the image, if any.
   */
  visible_text?: string | null;
  subjects?: Array<ImageSubject>;
};
