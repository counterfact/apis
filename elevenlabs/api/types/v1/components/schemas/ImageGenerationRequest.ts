import type { GPTImage1Request } from "./GPTImage1Request.js";
import type { GPTImage1_5Request } from "./GPTImage1_5Request.js";
import type { GPTImage2Request } from "./GPTImage2Request.js";
import type { GPTImage25SunburstRequest } from "./GPTImage25SunburstRequest.js";
import type { GPTImage25FlareRequest } from "./GPTImage25FlareRequest.js";
import type { Gemini25FlashImageRequest } from "./Gemini25FlashImageRequest.js";
import type { Gemini3ProImageRequest } from "./Gemini3ProImageRequest.js";
import type { Gemini31FlashImageRequest } from "./Gemini31FlashImageRequest.js";
import type { Gemini31FlashLiteImageRequest } from "./Gemini31FlashLiteImageRequest.js";
import type { BytedanceSeedream5LiteRequest } from "./BytedanceSeedream5LiteRequest.js";
import type { BytedanceSeedream5ProRequest } from "./BytedanceSeedream5ProRequest.js";
export type ImageGenerationRequest =
  | (GPTImage1Request & { model_id: "gpt-image-1" })
  | (GPTImage1_5Request & { model_id: "gpt-image-1.5" })
  | (GPTImage2Request & { model_id: "gpt-image-2" })
  | (GPTImage25SunburstRequest & { model_id: "gpt-image-2.5-sunburst" })
  | (GPTImage25FlareRequest & { model_id: "gpt-image-2.5-flare" })
  | (Gemini25FlashImageRequest & { model_id: "gemini-2.5-flash-image" })
  | (Gemini3ProImageRequest & { model_id: "gemini-3-pro-image" })
  | (Gemini31FlashImageRequest & { model_id: "gemini-3.1-flash-image" })
  | (Gemini31FlashLiteImageRequest & {
      model_id: "gemini-3.1-flash-lite-image";
    })
  | (BytedanceSeedream5LiteRequest & { model_id: "bytedance-seedream-5-lite" })
  | (BytedanceSeedream5ProRequest & { model_id: "bytedance-seedream-5-pro" });
