/**
 * Only ``group_id`` is acted on; ``workflow_name`` and ``metadata`` are kept so the echoed session matches the request.
 */
export type OpenAITracingConfiguration = {
  /**
   * Adds conversation to the group (case-insensitive, up to 64 chars).
   */
  group_id?: string | null;
  workflow_name?: string | null;
  metadata?: { [key: string]: unknown } | null;
};
