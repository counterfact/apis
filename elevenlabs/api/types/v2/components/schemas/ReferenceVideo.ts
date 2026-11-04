import type { StudioClipLocator } from "./StudioClipLocator.js";
export type ReferenceVideo = {
  generation_id?: string | null;
  content_asset_id?: string | null;
  template_node_id?: string | null;
  studio_clip?: StudioClipLocator | null;
};
