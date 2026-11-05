import type { AudioEffectsCatalogResponseModel as Catalog } from "../../types/v1/components/schemas/AudioEffectsCatalogResponseModel.js";

export class Context {
  filterPresets = new Map<string, Catalog["filter_presets"][number]>();
  environments = new Map<string, Catalog["environments"][number]>();
  backgroundNoises = new Map<string, Catalog["background_noises"][number]>();

  catalog(): Catalog {
    return structuredClone({
      filter_presets: [...this.filterPresets.values()].sort((a, b) =>
        a.filter_preset_id.localeCompare(b.filter_preset_id),
      ),
      environments: [...this.environments.values()].sort((a, b) =>
        a.environment_id.localeCompare(b.environment_id),
      ),
      background_noises: [...this.backgroundNoises.values()].sort((a, b) =>
        a.background_noise_id.localeCompare(b.background_noise_id),
      ),
    });
  }
}
