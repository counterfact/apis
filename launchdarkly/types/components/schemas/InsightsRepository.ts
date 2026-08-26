import type { ProjectSummaryCollection } from "./ProjectSummaryCollection.js";

export type InsightsRepository = {
  /**
   * The repository ID
   * @format uuid
   * @example "5f9a9b1a-5b9a-4b9a-9a9a-9a9a9a9a9a9a"
   */
  _id: string;
  /**
   * The repository version
   * @example 1
   */
  version: number;
  /**
   * The repository key
   * @example "launchdarkly/LaunchDarkly-Docs"
   */
  key: string;
  /**
   * The repository type
   * @example "github"
   */
  type: string;
  /**
   * The repository URL
   * @example "https://github.com/launchdarkly/LaunchDarkly-Docs"
   */
  url: string;
  /**
   * The repository main branch
   * @example "main"
   */
  mainBranch: string;
  projects?: ProjectSummaryCollection;
};
