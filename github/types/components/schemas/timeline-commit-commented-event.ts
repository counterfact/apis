import type { commit_comment } from "./commit-comment.js";

/**
 * Timeline Commit Commented Event
 */
export type timeline_commit_commented_event = {
  event?: string;
  node_id?: string;
  commit_id?: string;
  comments?: Array<commit_comment>;
};
