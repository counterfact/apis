import type { nullable_code_of_conduct_simple } from "./nullable-code-of-conduct-simple.js";
import type { nullable_community_health_file } from "./nullable-community-health-file.js";
import type { nullable_license_simple } from "./nullable-license-simple.js";

/**
 * Community Profile
 */
export type community_profile = {
  /**
   * @example 100
   */
  health_percentage: number;
  /**
   * @example "My first repository on GitHub!"
   */
  description: string;
  /**
   * @example "example.com"
   */
  documentation: string;
  files: {
    code_of_conduct: nullable_code_of_conduct_simple;
    code_of_conduct_file: nullable_community_health_file;
    license: nullable_license_simple;
    contributing: nullable_community_health_file;
    readme: nullable_community_health_file;
    issue_template: nullable_community_health_file;
    pull_request_template: nullable_community_health_file;
  };
  /**
   * @format date-time
   * @example "2017-02-28T19:09:29Z"
   */
  updated_at: string;
  /**
   * @example true
   */
  content_reports_enabled?: boolean;
};
