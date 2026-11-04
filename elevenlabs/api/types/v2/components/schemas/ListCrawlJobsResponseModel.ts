import type { GetCrawlJobResponseModel } from "./GetCrawlJobResponseModel.js";
export type ListCrawlJobsResponseModel = {
  crawl_jobs: Array<GetCrawlJobResponseModel>;
  next_cursor?: string | null;
};
