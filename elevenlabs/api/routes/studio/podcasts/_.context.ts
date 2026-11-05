import type { Context as Studio } from "../projects/_.context.js";
export class Context {
  studio?: () => Studio;
  podcast(body: unknown) {
    if (!this.studio) throw new Error("Run startup or reset");
    return this.studio().podcast(body);
  }
}
