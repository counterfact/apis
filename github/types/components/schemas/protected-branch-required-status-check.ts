/**
 * Protected Branch Required Status Check
 */
export type protected_branch_required_status_check = {
  url?: string;
  enforcement_level?: string;
  contexts: Array<string>;
  checks: Array<{ context: string; app_id: number }>;
  contexts_url?: string;
  strict?: boolean;
};
