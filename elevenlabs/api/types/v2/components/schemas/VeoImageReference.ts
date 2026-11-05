import type { ImageReference } from "./ImageReference.js";
/**
 * A reference image guiding a Veo generation, with its role.
 */
export type VeoImageReference = {
  /**
   * The reference image.
   */
  image: ImageReference;
  /**
   * How the model uses the image: `subject` places its subject or scene elements into the video; `style` transfers its visual style.
   */
  role: "subject" | "style";
};
