import type { issue } from "./issue.js";
import type { issue_comment } from "./issue-comment.js";

export type issue_comment_event = {
  action: string;
  issue: issue;
  comment: issue_comment;
};
