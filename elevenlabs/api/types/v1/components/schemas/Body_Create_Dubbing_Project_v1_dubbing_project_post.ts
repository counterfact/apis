export type Body_Create_Dubbing_Project_v1_dubbing_project_post = {
  /**
   * The source media file to dub: an audio or video file of at most 3 GiB. Provide this or `source_url`, not both.
   */
  file?: (Uint8Array | string) | null;
  /**
   * Public HTTP(S) URL the source media is fetched from server-side, subject to the same size and format limits as an upload. Provide this or `file`, not both.
   */
  source_url?: string | null;
  /**
   * Optional free-form string (at most 500 characters) to identify the project on your end. Stored and echoed back verbatim; it does not affect the dub.
   */
  reference?: string | null;
  /**
   * BCP-47 language tag of the source media; must be a language the transcription model supports. Any region or script subtag is ignored, since transcription is per-language. Omit to auto-detect.
   */
  source_language?: string | null;
  /**
   * Dubbing model (`dubbing_v1` or `dubbing_v2`) every language target of this project is dubbed with. Defaults to `dubbing_v2`. Fixed at create time — the source is prepared for this model, so neither the project nor an individual target can change it later.
   */
  model_id?: ("dubbing_v1" | "dubbing_v2") | string | null;
  /**
   * Key terms to bias transcription and translation toward (for example, product or brand names). At most 1,000 terms; each term at most 50 characters and 5 words; the characters `<>{}[]\` are not allowed. Terms are trimmed and deduplicated. Repeat the field once per term, or pass a single JSON array.
   */
  keyterms?: Array<string>;
  /**
   * IDs of workspace webhooks to notify as this project progresses — the alternative to polling, and what we recommend. Each receives a `dubbing_project_ready` or `dubbing_project_failed` event for the project, and a `dubbing_language_completed` or `dubbing_language_failed` event for every language under it; `dubbing_language_completed` carries the output download URLs. At most 3 IDs, each already configured in your workspace — see [Webhooks](https://elevenlabs.io/docs/eleven-api/resources/webhooks) for how to create one and verify its signature. Repeat the field once per ID, or pass a single JSON array or comma-separated string. Delivery is best-effort and can repeat, so we recommend handling events idempotently.
   */
  webhook_ids?: Array<string>;
  /**
   * Optional shortcut: also create a language target in this BCP-47 language, queued to start once the project is ready — equivalent to creating the project and then creating one language target. Must be one of the [languages the dubbing model supports](https://elevenlabs.io/docs/help-center/product/dubbing/which-languages-are-supported-in-dubbing), and a region-qualified tag must be one of the supported dialects. This is the first language target, so it consumes the project's minimum charge rather than adding to it. Its ID is returned in `language_ids`.
   */
  target_language?: string | null;
  /**
   * Enterprise only. Optional JSON transcript to use instead of transcribing the source: a `{"segments": [...]}` document, at most 20,000 segments and 4 MiB. See [Bring your own transcript](https://elevenlabs.io/docs/eleven-api/guides/how-to/dubbing/bring-your-own-transcript) for the segment fields and their constraints. `source_language` is required whenever a transcript is provided. If any segment carries a `translation`, `target_language` is required and every segment must carry one; those translations seed the target created via `target_language`, which then skips machine translation.
   */
  transcript?: (Uint8Array | string) | null;
};
