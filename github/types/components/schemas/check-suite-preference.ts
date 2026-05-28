import type { minimal_repository } from "./minimal-repository.js";

/**
 * Check suite configuration preferences for a repository.
 */
export type check_suite_preference = {
  preferences: {
    auto_trigger_checks?: Array<{ app_id: number; setting: boolean }>;
  };
  repository: minimal_repository;
};
