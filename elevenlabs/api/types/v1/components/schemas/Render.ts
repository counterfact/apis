import type { RenderType } from "./RenderType.js";
import type { DubbingMediaReference } from "./DubbingMediaReference.js";
export type Render = {
  id: string;
  version: number;
  language: string | null;
  type: RenderType | null;
  media_ref: DubbingMediaReference | null;
  status: "complete" | "processing" | "failed";
};
