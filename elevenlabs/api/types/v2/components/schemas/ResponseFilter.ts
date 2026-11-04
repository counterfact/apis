import type { ResponseFilterMode } from "./ResponseFilterMode.js";
/**
 * Configuration for filtering tool responses before they are visible to the agent.
 */
export type ResponseFilter = {
  /**
   * Controls how tool responses are filtered. 'all' returns entire response, 'allow' returns only specified paths, 'hide_all' hides the entire response.
   * @default "all"
   */
  mode?: ResponseFilterMode;
  /**
   * Dot notation paths to include when mode is 'allow' (e.g., ['ticket.id', 'ticket.status']).
   */
  filters?: Array<string>;
  /**
   * Content type for response filtering. Only 'application/json' responses are filtered.
   * @default "application/json"
   */
  content_type?: "application/json";
};
