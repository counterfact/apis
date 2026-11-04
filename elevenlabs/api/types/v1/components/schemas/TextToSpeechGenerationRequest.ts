import type { ElevenFlashV2_5Request } from "./ElevenFlashV2_5Request.js";
import type { ElevenMultilingualV2Request } from "./ElevenMultilingualV2Request.js";
import type { ElevenV3Request } from "./ElevenV3Request.js";
export type TextToSpeechGenerationRequest =
  | (ElevenFlashV2_5Request & { model_id: "eleven_flash_v2_5" })
  | (ElevenMultilingualV2Request & { model_id: "eleven_multilingual_v2" })
  | (ElevenV3Request & { model_id: "eleven_v3" });
