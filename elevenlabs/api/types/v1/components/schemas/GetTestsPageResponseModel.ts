import type { UnitTestSummaryResponseModel } from "./UnitTestSummaryResponseModel.js";
export type GetTestsPageResponseModel = {
  tests: Array<UnitTestSummaryResponseModel>;
  next_cursor?: string | null;
  has_more: boolean;
};
