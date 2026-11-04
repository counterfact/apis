export type ReviewResponseModel = {
  review_status: "approved" | "edits_required" | "rejected";
  reviewed_at_unix: number;
  reviewed_by?: string | null;
  reject_reasons?: Array<
    | "lacks_structure"
    | "doesnt_open"
    | "not_literary_work"
    | "language_not_supported"
    | "too_short"
    | "duplicate"
    | "promotional"
    | "formatting_issues"
    | "low_quality"
    | "metadata_incomplete"
    | "metadata_inaccurate"
    | "typos"
    | "review_error"
    | "spam"
    | "legal_violation"
    | "content_policy"
    | "public_domain"
    | "other"
  > | null;
  scores_breakdown?: { [key: string]: number } | null;
  rejected_details?: string | null;
  explanation?: string | null;
};
