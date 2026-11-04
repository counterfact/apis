export type ContextualUpdateInfo = {
  /**
   * Client-supplied identifier grouping related contextual updates.
   */
  context_id: string;
  /**
   * True when this contextual update has been replaced by a newer update with the same context_id.
   * @default false
   */
  is_superseded?: boolean;
};
