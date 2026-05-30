#!/usr/bin/env python3
"""Process issue proposal files and create GitHub issues.

Reads file paths from the PROPOSAL_FILES environment variable (newline-separated),
parses the YAML front matter, validates required fields, creates a GitHub issue
via the gh CLI, and optionally links it as a sub-issue when a parent can be
resolved from front matter or the branch name. The issue body includes a
proposal marker so reruns can skip proposals that already created an issue.

Exit codes:
  0 – all proposals processed successfully (or no proposals found)
  1 – one or more proposals failed validation or issue creation
"""

import os
import re
import subprocess
import sys

import yaml

PROPOSAL_MARKER_PREFIX = "cf-proposal-path:"


def parse_proposal(filepath):
    """Return (metadata dict, body str) for a Markdown proposal file.

    Raises ValueError if the file is malformed.
    """
    with open(filepath, encoding="utf-8") as fh:
        content = fh.read()

    if not content.startswith("---"):
        raise ValueError(f"No YAML front matter found in {filepath!r}")

    parts = content.split("---", 2)
    if len(parts) < 3:
        raise ValueError(f"Front matter is not properly closed in {filepath!r}")

    raw_yaml = parts[1]
    body = parts[2].strip()

    try:
        metadata = yaml.safe_load(raw_yaml)
    except yaml.YAMLError as exc:
        raise ValueError(f"Invalid YAML in front matter of {filepath!r}: {exc}") from exc

    if not isinstance(metadata, dict):
        raise ValueError(f"Front matter must be a YAML mapping in {filepath!r}")

    return metadata, body


def _gh(*args, check=True):
    """Run a gh CLI command and return its stdout, raising on failure."""
    result = subprocess.run(
        ["gh", *args],
        capture_output=True,
        text=True,
    )
    if check and result.returncode != 0:
        message = result.stderr.strip() or result.stdout.strip()
        raise RuntimeError(f"gh command failed: {message}")
    return result


def get_parent_issue_from_context(ref):
    """Try to derive a parent issue number from the current branch name.

    Supported examples include ``issue-1234``, ``fix/1234``,
    ``1234-description``, and ``description-1234``.
    """
    if not ref:
        return None

    branch = re.sub(r"^refs/heads/", "", ref)
    segment = branch.split("/")[-1]

    for pattern in (
        r"(?:issue|fix|feat|feature|bug|chore|refactor)[-/](\d+)",
        r"^(\d+)[-_]",
        r"[-_](\d+)$",
        r"[-_](\d+)[-_]",
    ):
        match = re.search(pattern, segment)
        if match:
            return int(match.group(1))

    return None


def resolve_parent_issue(metadata, ref):
    """Return the parent issue number as int, or None."""
    raw = metadata.get("parentIssue")
    if raw is not None:
        try:
            return int(raw)
        except (ValueError, TypeError):
            pass

    return get_parent_issue_from_context(ref)


def create_github_issue(repo, title, body, labels, assignees, milestone):
    """Create a GitHub issue via the GitHub API. Return (issue_number, issue_id, issue_url)."""
    fields = ["-f", f"title={title}", "-f", f"body={body}"]

    for label in labels:
        fields += ["-f", f"labels[]={label}"]

    for assignee in assignees:
        fields += ["-f", f"assignees[]={assignee}"]

    if milestone:
        fields += ["-f", f"milestone={milestone}"]

    result = _gh(
        "api",
        "--method",
        "POST",
        "-H",
        "Accept: application/vnd.github+json",
        f"repos/{repo}/issues",
        *fields,
        "--jq",
        ".number,.id,.html_url",
    )

    lines = result.stdout.strip().splitlines()
    if len(lines) < 3:
        raise RuntimeError(f"Unexpected response from issues API: {result.stdout!r}")

    issue_number = int(lines[0])
    issue_id = int(lines[1])
    issue_url = lines[2]
    return issue_number, issue_id, issue_url


def build_proposal_marker(proposal_path):
    """Return the unique body marker for a proposal file path."""
    return f"{PROPOSAL_MARKER_PREFIX}{proposal_path}"


def issue_body_with_marker(body, proposal_path):
    """Append proposal marker to an issue body for idempotency."""
    marker = build_proposal_marker(proposal_path)
    return f"{body.rstrip()}\n\n<!-- {marker} -->"


def find_existing_issue_for_proposal(repo, proposal_path):
    """Return existing issue number for proposal_path, or None."""
    marker = build_proposal_marker(proposal_path)
    query = f'repo:{repo} is:issue state:all in:body "{marker}"'
    result = _gh(
        "api",
        "--method",
        "GET",
        "search/issues",
        "-f",
        f"q={query}",
        "--jq",
        ".items[0].number // empty",
    )
    value = result.stdout.strip()
    if not value:
        return None
    return int(value)


def add_sub_issue(repo, parent_number, child_issue_id):
    """Register the issue identified by child_issue_id as a sub-issue of parent_number."""
    result = _gh(
        "api",
        "--method",
        "POST",
        "-H",
        "Accept: application/vnd.github+json",
        f"repos/{repo}/issues/{parent_number}/sub_issues",
        "-f",
        f"sub_issue_id={child_issue_id}",
        check=False,
    )
    if result.returncode != 0:
        print(
            "  Warning: issue was created, but could not link it as a sub-issue: "
            f"{result.stderr.strip()}",
            file=sys.stderr,
        )
        return False
    return True


def main():
    repo = os.environ.get("GITHUB_REPOSITORY", "")
    ref = os.environ.get("GITHUB_REF", "")
    proposal_files_env = os.environ.get("PROPOSAL_FILES", "").strip()

    if not repo:
        print("Error: GITHUB_REPOSITORY environment variable is not set.", file=sys.stderr)
        sys.exit(1)

    files = [f.strip() for f in proposal_files_env.splitlines() if f.strip()]

    if not files:
        print("No proposal files found — nothing to do.")
        return

    failed = False

    for filepath in files:
        print(f"\nProcessing: {filepath}")

        try:
            metadata, body = parse_proposal(filepath)
        except ValueError as exc:
            print(f"  Error: {exc}", file=sys.stderr)
            failed = True
            continue

        title = (metadata.get("title") or "").strip()
        if not title:
            print(f"  Error: 'title' is missing or empty in {filepath!r}", file=sys.stderr)
            failed = True
            continue

        if not body:
            print(f"  Error: body content is empty in {filepath!r}", file=sys.stderr)
            failed = True
            continue

        existing_issue = find_existing_issue_for_proposal(repo, filepath)
        if existing_issue is not None:
            print(f"  Skipping: issue already exists for {filepath} as #{existing_issue}")
            continue

        parent_issue = resolve_parent_issue(metadata, ref)

        print(f"  Title:        {title}")
        if parent_issue is None:
            print("  Parent issue: none (creating standalone issue)")
        else:
            print(f"  Parent issue: #{parent_issue}")

        labels = [str(lbl) for lbl in (metadata.get("labels") or [])]
        assignees = [str(a) for a in (metadata.get("assignees") or [])]
        milestone = metadata.get("milestone")
        body_with_marker = issue_body_with_marker(body, filepath)

        try:
            issue_number, issue_id, issue_url = create_github_issue(
                repo, title, body_with_marker, labels, assignees, milestone
            )
        except RuntimeError as exc:
            print(f"  Error creating issue: {exc}", file=sys.stderr)
            failed = True
            continue

        print(f"  Created:      #{issue_number} — {issue_url}")

        if parent_issue is not None:
            linked = add_sub_issue(repo, parent_issue, issue_id)
            if linked:
                print(f"  Linked as sub-issue of #{parent_issue}")

    if failed:
        sys.exit(1)


if __name__ == "__main__":
    main()
