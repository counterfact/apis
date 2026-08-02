import type { Context$ } from "../types/_.context.js";
import { CommerceStore } from "../domain/store.ts";

/**
 * This is the default context for Counterfact.
 *
 * It defines the context object in the REPL
 * and the $.context object in the code.
 *
 * Add properties and methods to suit your needs.
 *
 * See https://github.com/counterfact/api-simulator/blob/main/docs/features/state.md
 */

export class Context {
  readonly store = new CommerceStore();

  constructor($: Context$) {
    void $;
  }

  reset() {
    this.store.reset();
  }
}
