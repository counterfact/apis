import type { LLMInfoModel } from "../../../types/v1/components/schemas/LLMInfoModel.js";
import type { LLMDeprecationConfigModel } from "../../../types/v1/components/schemas/LLMDeprecationConfigModel.js";
import type { LLMListResponseModel } from "../../../types/v1/components/schemas/LLMListResponseModel.js";

export class Context {
  models = new Map<LLMInfoModel["llm"], LLMInfoModel>();
  deprecationConfig: LLMDeprecationConfigModel | null = null;

  listModels(): LLMListResponseModel {
    if (!this.deprecationConfig) throw new Error("Run an LLM catalog initialization scenario first");
    return structuredClone({
      llms: [...this.models.values()],
      default_deprecation_config: this.deprecationConfig,
    });
  }
}
