import type { Context$ } from "../../types/_.context.js";
import type { code_of_conduct } from "../../types/components/schemas/code-of-conduct.js";

export class Context {
  private readonly codes = new Map<string, code_of_conduct>();

  constructor(private readonly $: Context$) {}

  saveCodeOfConduct(value: code_of_conduct): code_of_conduct {
    this.codes.set(value.key, value);
    return value;
  }

  listCodesOfConduct(): code_of_conduct[] {
    return [...this.codes.values()].sort((left, right) =>
      left.key.localeCompare(right.key),
    );
  }

  getCodeOfConduct(key: string): code_of_conduct | undefined {
    return this.codes.get(key);
  }
}
