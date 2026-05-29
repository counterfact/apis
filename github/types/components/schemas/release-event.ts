import type { release } from "./release.js";

export type release_event = {
  action: string;
  release: release & {
    is_short_description_html_truncated?: boolean;
    short_description_html?: string;
  };
};
