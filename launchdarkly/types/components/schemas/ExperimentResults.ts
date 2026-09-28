import type { ExperimentMetadataRep } from "./ExperimentMetadataRep.js";
import type { ExperimentTotalsRep } from "./ExperimentTotalsRep.js";
import type { ExperimentTimeSeriesSlice } from "./ExperimentTimeSeriesSlice.js";
import type { ExperimentStatsRep } from "./ExperimentStatsRep.js";
import type { MetricSeen } from "./MetricSeen.js";

export type ExperimentResults = {
  _links?: { [key: string]: unknown };
  metadata?: Array<ExperimentMetadataRep>;
  totals?: Array<ExperimentTotalsRep>;
  series?: Array<ExperimentTimeSeriesSlice>;
  stats?: ExperimentStatsRep;
  granularity?: string;
  metricSeen?: MetricSeen;
};
