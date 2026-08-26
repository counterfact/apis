import type { Integration } from "./Integration.js";

export type Integrations = {
  _links?: { [key: string]: unknown };
  items?: Array<Integration>;
  key?: string;
};
