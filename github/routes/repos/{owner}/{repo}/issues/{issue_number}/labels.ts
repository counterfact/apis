import type { issuesListLabelsOnIssue } from "../../../../../../types/paths/repos/{owner}/{repo}/issues/{issue_number}/labels.types.js";
import type { issuesAddLabels } from "../../../../../../types/paths/repos/{owner}/{repo}/issues/{issue_number}/labels.types.js";
import type { issuesSetLabels } from "../../../../../../types/paths/repos/{owner}/{repo}/issues/{issue_number}/labels.types.js";
import type { issuesRemoveAllLabels } from "../../../../../../types/paths/repos/{owner}/{repo}/issues/{issue_number}/labels.types.js";

const toLabelNames = (input: unknown): string[] => {
  if (typeof input === "string") {
    return [input];
  }

  if (Array.isArray(input)) {
    return input.flatMap((item) => {
      if (typeof item === "string") {
        return [item];
      }
      if (item && typeof item === "object" && "name" in item) {
        return [String(item.name)];
      }
      return [];
    });
  }

  if (input && typeof input === "object" && "labels" in input) {
    return toLabelNames(input.labels);
  }

  return [];
};

const hasIssue = ($: {
  context: {
    hasRepository(owner: string, repo: string): boolean;
    getIssue(owner: string, repo: string, issueNumber: number): unknown;
  };
  path: { owner: string; repo: string; issue_number: number };
  response: Record<number, { empty(): unknown }>;
}) => {
  if (!$.context.hasRepository($.path.owner, $.path.repo)) {
    return $.response[404].empty();
  }

  if (!$.context.getIssue($.path.owner, $.path.repo, $.path.issue_number)) {
    return $.response[404].empty();
  }

  return undefined;
};

export const GET: issuesListLabelsOnIssue = async ($) => {
  const missing = hasIssue($);
  if (missing) {
    return missing;
  }

  return $.response[200].json(
    $.context.listIssueLabels($.path.owner, $.path.repo, $.path.issue_number, $.query),
  );
};

export const POST: issuesAddLabels = async ($) => {
  const missing = hasIssue($);
  if (missing) {
    return missing;
  }

  return $.response[200].json(
    $.context.addLabelToIssue(
      $.path.owner,
      $.path.repo,
      $.path.issue_number,
      toLabelNames($.body),
    ),
  );
};

export const PUT: issuesSetLabels = async ($) => {
  const missing = hasIssue($);
  if (missing) {
    return missing;
  }

  return $.response[200].json(
    $.context.replaceIssueLabels(
      $.path.owner,
      $.path.repo,
      $.path.issue_number,
      toLabelNames($.body),
    ),
  );
};

export const DELETE: issuesRemoveAllLabels = async ($) => {
  const missing = hasIssue($);
  if (missing) {
    return missing;
  }

  $.context.replaceIssueLabels(
    $.path.owner,
    $.path.repo,
    $.path.issue_number,
    [],
  );
  return $.response[204].empty();
};
