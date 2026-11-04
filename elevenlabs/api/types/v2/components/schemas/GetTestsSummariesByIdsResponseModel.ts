import type { UnitTestSummaryResponseModel } from "./UnitTestSummaryResponseModel.js";
export type GetTestsSummariesByIdsResponseModel = {
  /**
   * Dictionary mapping test IDs to their summary information
   */
  tests: { [key: string]: UnitTestSummaryResponseModel };
};
