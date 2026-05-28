import type { code_scanning_autofix_status } from "./code-scanning-autofix-status.js";
import type { code_scanning_autofix_description } from "./code-scanning-autofix-description.js";
import type { code_scanning_autofix_started_at } from "./code-scanning-autofix-started-at.js";

export type code_scanning_autofix = {
  status: code_scanning_autofix_status;
  description: code_scanning_autofix_description;
  started_at: code_scanning_autofix_started_at;
};
