import type { repository_rule_creation } from "./repository-rule-creation.js";
import type { repository_rule_update } from "./repository-rule-update.js";
import type { repository_rule_deletion } from "./repository-rule-deletion.js";
import type { repository_rule_required_linear_history } from "./repository-rule-required-linear-history.js";
import type { repository_rule_merge_queue } from "./repository-rule-merge-queue.js";
import type { repository_rule_required_deployments } from "./repository-rule-required-deployments.js";
import type { repository_rule_required_signatures } from "./repository-rule-required-signatures.js";
import type { repository_rule_pull_request } from "./repository-rule-pull-request.js";
import type { repository_rule_required_status_checks } from "./repository-rule-required-status-checks.js";
import type { repository_rule_non_fast_forward } from "./repository-rule-non-fast-forward.js";
import type { repository_rule_commit_message_pattern } from "./repository-rule-commit-message-pattern.js";
import type { repository_rule_commit_author_email_pattern } from "./repository-rule-commit-author-email-pattern.js";
import type { repository_rule_committer_email_pattern } from "./repository-rule-committer-email-pattern.js";
import type { repository_rule_branch_name_pattern } from "./repository-rule-branch-name-pattern.js";
import type { repository_rule_tag_name_pattern } from "./repository-rule-tag-name-pattern.js";
import type { repository_rule_workflows } from "./repository-rule-workflows.js";
import type { repository_rule_code_scanning } from "./repository-rule-code-scanning.js";
import type { repository_rule_copilot_code_review } from "./repository-rule-copilot-code-review.js";
import type { repository_rule_file_path_restriction } from "./repository-rule-file-path-restriction.js";
import type { repository_rule_max_file_path_length } from "./repository-rule-max-file-path-length.js";
import type { repository_rule_file_extension_restriction } from "./repository-rule-file-extension-restriction.js";
import type { repository_rule_max_file_size } from "./repository-rule-max-file-size.js";

/**
 * A repository rule.
 */
export type repository_rule =
  | repository_rule_creation
  | repository_rule_update
  | repository_rule_deletion
  | repository_rule_required_linear_history
  | repository_rule_merge_queue
  | repository_rule_required_deployments
  | repository_rule_required_signatures
  | repository_rule_pull_request
  | repository_rule_required_status_checks
  | repository_rule_non_fast_forward
  | repository_rule_commit_message_pattern
  | repository_rule_commit_author_email_pattern
  | repository_rule_committer_email_pattern
  | repository_rule_branch_name_pattern
  | repository_rule_tag_name_pattern
  | repository_rule_workflows
  | repository_rule_code_scanning
  | repository_rule_copilot_code_review
  | repository_rule_file_path_restriction
  | repository_rule_max_file_path_length
  | repository_rule_file_extension_restriction
  | repository_rule_max_file_size;
