/**
 * The accepted re-dub: what it covers and what it cost.
 */
export type DubbingRegenerateResponse = {
  /**
   * The segments this re-dub re-synthesizes: those with edits to apply.
   */
  regenerated_segment_ids: Array<string>;
  /**
   * Seconds of audio this re-dub covers — the edited regions only, never the whole target. `charged_seconds` is the part of it that was billed.
   */
  regenerated_seconds: number;
  /**
   * Seconds actually billed, after the free-regeneration allowance. Zero when the re-dub cost nothing — either the allowance covered all of it, or the project's included generation did.
   */
  charged_seconds: number;
  /**
   * Free-regeneration seconds left for this language target after this re-dub. The allowance is the source's own duration.
   */
  free_regeneration_seconds_remaining: number;
};
