import type { CreatifyAuroraRequest } from "./CreatifyAuroraRequest.js";
import type { Veo3_1Request } from "./Veo3_1Request.js";
import type { Veo3_1FastRequest } from "./Veo3_1FastRequest.js";
import type { BytedanceSeedance2Request } from "./BytedanceSeedance2Request.js";
import type { BytedanceSeedance2FastRequest } from "./BytedanceSeedance2FastRequest.js";
import type { BytedanceSeedance2MiniRequest } from "./BytedanceSeedance2MiniRequest.js";
import type { BytedanceSeedance25Request } from "./BytedanceSeedance25Request.js";
export type VideoGenerationRequest =
  | (CreatifyAuroraRequest & { model_id: "creatify-aurora" })
  | (Veo3_1Request & { model_id: "veo-3.1-generate-001" })
  | (Veo3_1FastRequest & { model_id: "veo-3.1-fast-generate-001" })
  | (BytedanceSeedance2Request & { model_id: "bytedance-seedance-v2" })
  | (BytedanceSeedance2FastRequest & { model_id: "bytedance-seedance-v2-fast" })
  | (BytedanceSeedance2MiniRequest & { model_id: "bytedance-seedance-v2-mini" })
  | (BytedanceSeedance25Request & { model_id: "bytedance-seedance-v2.5" });
