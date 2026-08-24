import type { Context$ } from "../../types/_.context.js";
import type { gitignore_template } from "../../types/components/schemas/gitignore-template.js";

export class Context {
  private readonly templates = new Map<string, gitignore_template>();

  constructor(private readonly $: Context$) {}

  saveGitignoreTemplate(value: gitignore_template): gitignore_template {
    this.templates.set(value.name, value);
    return value;
  }

  listGitignoreTemplates(): string[] {
    return [...this.templates.keys()].sort((left, right) =>
      left.localeCompare(right),
    );
  }

  getGitignoreTemplate(name: string): gitignore_template | undefined {
    return this.templates.get(name);
  }
}
