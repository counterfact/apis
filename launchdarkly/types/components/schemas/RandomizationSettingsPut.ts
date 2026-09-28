import type { RandomizationUnitInput } from "./RandomizationUnitInput.js";

export type RandomizationSettingsPut = {
  /**
   * An array of randomization units allowed for this project.
   */
  randomizationUnits: Array<RandomizationUnitInput>;
};
