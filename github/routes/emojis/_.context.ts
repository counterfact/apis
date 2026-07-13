import type { Context$ } from "../../types/_.context.js";

export type EmojiMap = Record<string, string>;

export class Context {
  private readonly emojis = new Map<string, string>();

  constructor(private readonly $: Context$) {}

  saveEmoji(name: string, url: string): void {
    this.emojis.set(name, url);
  }

  listEmojis(): EmojiMap {
    return Object.fromEntries(this.emojis);
  }
}
