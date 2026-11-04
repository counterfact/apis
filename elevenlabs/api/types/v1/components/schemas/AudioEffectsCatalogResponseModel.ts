import type { AudioEffectsFilterPresetResponseModel } from "./AudioEffectsFilterPresetResponseModel.js";
import type { AudioEffectsEnvironmentResponseModel } from "./AudioEffectsEnvironmentResponseModel.js";
import type { AudioEffectsBackgroundNoiseResponseModel } from "./AudioEffectsBackgroundNoiseResponseModel.js";
export type AudioEffectsCatalogResponseModel = {
  filter_presets: Array<AudioEffectsFilterPresetResponseModel>;
  environments: Array<AudioEffectsEnvironmentResponseModel>;
  background_noises: Array<AudioEffectsBackgroundNoiseResponseModel>;
};
