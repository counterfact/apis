/**
 * Results of a successful merge upstream request
 */
export type merged_upstream = {
  message?: string;
  merge_type?: "merge" | "fast-forward" | "none";
  base_branch?: string;
};
