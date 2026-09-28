import type { UnixMillis } from "./UnixMillis.js";
import type { ExperimentTimeSeriesVariationSlices } from "./ExperimentTimeSeriesVariationSlices.js";

export type ExperimentTimeSeriesSlice = {
  Time?: UnixMillis;
  VariationData?: ExperimentTimeSeriesVariationSlices;
};
