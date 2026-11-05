import type { AgentMergeProposalResponse as Proposal } from "../../../../../types/v1/components/schemas/AgentMergeProposalResponse.js";
import type { Context as Lifecycle } from "../branches/_.context.js";
import type { StoredAgent } from "../../_.context.js";
export class ProposalError extends Error {
  override name = "ProposalError";
  constructor(
    public status: number,
    public code: string,
  ) {
    super(code);
  }
}
const fail = (status: number, code: string): never => {
  throw new ProposalError(status, code);
};
const invalid = (): never => fail(400, "invalid_merge_proposal");
const object = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);
const text = (v: unknown, max: number, min = 0): v is string =>
  typeof v === "string" && v.length >= min && v.length <= max;
const reviewers = (v: unknown) =>
  Array.isArray(v) &&
  v.length <= 100 &&
  v.every((x) => typeof x === "string" && !!x.trim());
export class Context {
  records = new Map<string, Proposal>();
  nextProposal = 0;
  nextComment = 0;
  nextMutation = 0;
  defaults?: { userId: string; time: number };
  agents?: () => Map<string, StoredAgent>;
  lifecycle?: Lifecycle;
  private agent(id: string) {
    return this.agents?.().get(id) ?? fail(404, "agent_not_found");
  }
  private settings() {
    if (!this.defaults) throw new Error("Run startup or reset");
    return this.defaults;
  }
  private tick() {
    return this.settings().time + ++this.nextMutation;
  }
  private record(agentId: string, id: string) {
    this.agent(agentId);
    const p = this.records.get(id);
    return p?.agent_id === agentId ? p : fail(404, "merge_proposal_not_found");
  }
  private open(p: Proposal) {
    if (p.outcome?.status !== "open") fail(409, "merge_proposal_closed");
  }
  get(agentId: string, id: string) {
    return structuredClone(this.record(agentId, id));
  }
  merge(agentId: string, id: string, input: unknown) {
    const proposal = this.record(agentId, id);
    this.open(proposal);
    if (
      !object(input) ||
      Object.keys(input).some(
        (key) => !["force", "archive_source_branch"].includes(key),
      ) ||
      Object.values(input).some((value) => typeof value !== "boolean")
    )
      return invalid();
    const lifecycle = this.lifecycle;
    if (!lifecycle) throw new Error("Run startup or reset");
    lifecycle.get(agentId, proposal.source_branch_id);
    if (
      lifecycle.branches.get(proposal.source_branch_id)!.tip !==
      proposal.source_tip_version_id_at_creation
    )
      return fail(409, "merge_proposal_source_changed");
    // Prepare all proposal data before the lifecycle transaction. A failed merge
    // must leave the review record and its mutation clock untouched.
    const next = structuredClone(proposal), settings = this.settings();
    const merged = lifecycle.merge(
      agentId, proposal.source_branch_id, proposal.target_branch_id, input,
    );
    const time = this.tick();
    next.outcome = {
      status: "merged", version_id: merged.version_id,
      at: time, by_user_id: settings.userId,
    };
    next.updated_at = time;
    this.records.set(id, next);
    return structuredClone(next);
  }
  create(agentId: string, input: unknown) {
    const a = this.agent(agentId);
    if (
      !object(input) ||
      Object.keys(input).some(
        (k) =>
          ![
            "source_branch_id",
            "target_branch_id",
            "title",
            "description",
            "requested_reviewer_user_ids",
            "triage_ticket_id",
          ].includes(k),
      ) ||
      typeof input.source_branch_id !== "string" ||
      typeof input.target_branch_id !== "string" ||
      !text(input.title, 140, 1) ||
      !input.title.trim() ||
      (input.description !== undefined && !text(input.description, 4096)) ||
      (input.requested_reviewer_user_ids != null &&
        !reviewers(input.requested_reviewer_user_ids))
    )
      return invalid();
    if (input.triage_ticket_id != null)
      return fail(400, "unsupported_proposal_ticket_link");
    if (input.source_branch_id === input.target_branch_id) return invalid();
    const lifecycle = this.lifecycle;
    if (!lifecycle) throw new Error("Run startup or reset");
    const source = lifecycle.get(agentId, input.source_branch_id),
      target = lifecycle.get(agentId, input.target_branch_id);
    if (source.is_archived || target.is_archived)
      return fail(409, "branch_archived");
    const tip = lifecycle.branches.get(source.id)!.tip;
    lifecycle.version(agentId, tip);
    let id: string;
    do {
      id = `sim-merge-proposal-created-${++this.nextProposal}`;
    } while (this.records.has(id));
    const time = this.tick();
    this.records.set(id, {
      id,
      agent_id: agentId,
      source_branch_id: source.id,
      target_branch_id: target.id,
      source_tip_version_id_at_creation: tip,
      title: input.title,
      description: (input.description as string) ?? "",
      requested_reviewer_user_ids: [
        ...new Set((input.requested_reviewer_user_ids as string[]) ?? []),
      ],
      reviews: [],
      comments: [],
      outcome: { status: "open" },
      created_at: time,
      updated_at: time,
      author_user_id: this.settings().userId,
      access_info: structuredClone(a.configuration.access_info),
    });
    return { created_merge_proposal_id: id };
  }
  list(agentId: string, q: Record<string, unknown> = {}) {
    this.agent(agentId);
    const size = q.page_size ?? 100,
      cursor = q.cursor ?? "0";
    if (
      !Number.isInteger(size) ||
      Number(size) < 1 ||
      Number(size) > 100 ||
      typeof cursor !== "string" ||
      !/^(0|[1-9]\d*)$/.test(cursor) ||
      !Number.isSafeInteger(Number(cursor)) ||
      (q.status != null &&
        (typeof q.status !== "string" ||
          !["open", "closed", "merged"].includes(q.status))) ||
      ["source_branch_id", "target_branch_id", "search"].some(
        (k) => q[k] != null && typeof q[k] !== "string",
      ) ||
      (typeof q.search === "string" && q.search.length > 140)
    )
      return invalid();
    const rows = [...this.records.values()]
      .filter(
        (p) =>
          p.agent_id === agentId &&
          (q.status == null || p.outcome?.status === q.status) &&
          (q.source_branch_id == null ||
            p.source_branch_id === q.source_branch_id) &&
          (q.target_branch_id == null ||
            p.target_branch_id === q.target_branch_id) &&
          (q.search == null ||
            `${p.title}\n${p.description ?? ""}`
              .toLowerCase()
              .includes((q.search as string).toLowerCase())),
      )
      .sort((a, b) => b.created_at - a.created_at || a.id.localeCompare(b.id));
    const offset = Number(cursor),
      end = offset + Number(size),
      has_more = end < rows.length;
    return {
      results: structuredClone(rows.slice(offset, end)),
      next_cursor: has_more ? String(end) : null,
      has_more,
    };
  }
  update(agentId: string, id: string, input: unknown) {
    const p = this.record(agentId, id);
    this.open(p);
    if (
      !object(input) ||
      Object.keys(input).some(
        (k) =>
          ![
            "title",
            "description",
            "requested_reviewer_user_ids",
            "close",
          ].includes(k),
      ) ||
      (input.title != null &&
        (!text(input.title, 140, 1) || !input.title.trim())) ||
      (input.description != null && !text(input.description, 4096)) ||
      (input.requested_reviewer_user_ids != null &&
        !reviewers(input.requested_reviewer_user_ids)) ||
      (input.close !== undefined && typeof input.close !== "boolean")
    )
      return invalid();
    const next = structuredClone(p);
    if (input.title != null) next.title = input.title as string;
    if (input.description != null)
      next.description = input.description as string;
    if (input.requested_reviewer_user_ids != null)
      next.requested_reviewer_user_ids = [
        ...new Set(input.requested_reviewer_user_ids as string[]),
      ];
    const time = this.tick();
    next.updated_at = time;
    if (input.close === true)
      next.outcome = {
        status: "closed",
        reason:
          p.author_user_id === this.settings().userId
            ? "withdrawn"
            : "rejected",
        at: time,
        by_user_id: this.settings().userId,
      };
    this.records.set(id, next);
    return structuredClone(next);
  }
  review(agentId: string, id: string, input: unknown) {
    const p = this.record(agentId, id);
    this.open(p);
    if (
      !object(input) ||
      Object.keys(input).some((k) => !["state", "comment"].includes(k)) ||
      typeof input.state !== "string" ||
      !["approved", "changes_requested"].includes(input.state) ||
      (input.comment !== undefined && !text(input.comment, 4096))
    )
      return invalid();
    const time = this.tick(),
      user_id = this.settings().userId;
    const review = {
      user_id,
      state: input.state as "approved" | "changes_requested",
      submitted_at: time,
      comment: (input.comment as string) ?? "",
      reviewer_role: "admin" as const,
    };
    p.reviews = [
      ...(p.reviews ?? []).filter((r) => r.user_id !== user_id),
      review,
    ];
    p.updated_at = time;
    return structuredClone(p);
  }
  comment(agentId: string, id: string, input: unknown) {
    const p = this.record(agentId, id);
    if (
      !object(input) ||
      Object.keys(input).some((k) => k !== "body") ||
      !text(input.body, 4096, 1) ||
      !input.body.trim()
    )
      return invalid();
    let commentId: string;
    do {
      commentId = `sim-merge-comment-${++this.nextComment}`;
    } while (
      [...this.records.values()].some((r) =>
        r.comments?.some((c) => c.id === commentId),
      )
    );
    const time = this.tick();
    p.comments = [
      ...(p.comments ?? []),
      {
        id: commentId,
        user_id: this.settings().userId,
        body: input.body,
        created_at: time,
      },
    ];
    p.updated_at = time;
    return structuredClone(p);
  }
}
