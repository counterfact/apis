import type { LegacyExperimentRep } from "./LegacyExperimentRep.js";

export type ExperimentInfoRep = {
  baselineIdx: number;
  items: Array<LegacyExperimentRep>;
};
