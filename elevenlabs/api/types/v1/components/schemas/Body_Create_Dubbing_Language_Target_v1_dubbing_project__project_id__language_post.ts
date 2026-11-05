import type { VoiceSettings } from "./VoiceSettings.js";
export type Body_Create_Dubbing_Language_Target_v1_dubbing_project__project_id__language_post =
  {
    /**
     * BCP-47 language tag to dub the project into (for example, `fr` or `es-MX`). Must be one of the [languages the project's dubbing model supports](https://elevenlabs.io/docs/help-center/product/dubbing/which-languages-are-supported-in-dubbing), and a region-qualified tag must be one of the supported dialects.
     */
    target_language: string;
    /**
     * Voice settings applied to every speaker in this language. Omit to use the defaults.
     */
    voice_settings?: VoiceSettings | null;
    /**
     * Enterprise only. Optional translations to use instead of machine translation. A map from each source segment's `external_id` (or its `id`, if you supplied none) to the translated text; every source segment must be covered exactly once. At most 20,000 entries, totaling at most 4 MiB of text. See [Bring your own transcript](https://elevenlabs.io/docs/eleven-api/guides/how-to/dubbing/bring-your-own-transcript).
     */
    translations?: { [key: string]: string } | null;
  };
