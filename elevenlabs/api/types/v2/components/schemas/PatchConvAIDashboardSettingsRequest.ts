import type { DashboardCallSuccessChartModel } from "./DashboardCallSuccessChartModel.js";
import type { DashboardCriteriaChartModel } from "./DashboardCriteriaChartModel.js";
import type { DashboardDataCollectionChartModel } from "./DashboardDataCollectionChartModel.js";
export type PatchConvAIDashboardSettingsRequest = {
  charts?: Array<
    | (DashboardCallSuccessChartModel & { type: "call_success" })
    | (DashboardCriteriaChartModel & { type: "criteria" })
    | (DashboardDataCollectionChartModel & { type: "data_collection" })
  >;
};
