import type { ProjectSummary } from "./ProjectSummary.js";

export type ProjectSummaryCollection = {
  totalCount: number;
  items: Array<ProjectSummary>;
  _links?: { [key: string]: unknown };
};
