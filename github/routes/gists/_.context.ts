import type { Context$ } from "../../types/_.context.js";
import type { gist_comment } from "../../types/components/schemas/gist-comment.js";
import type { gist_simple } from "../../types/components/schemas/gist-simple.js";

const API_URL = "https://api.github.com";
const GIST_URL = "https://gist.github.com";
const DEFAULT_USER_LOGIN = "octocat";

const isoNow = () => new Date().toISOString();

type UsersContext = {
  saveUser(user: { login: string }): { login: string };
  getUser(login: string): { login: string } | undefined;
};

export class Context {
  private gistsById = new Map<string, gist_simple>();
  private starredGistIds = new Set<string>();
  private commentsByGistId = new Map<string, Map<number, gist_comment>>();
  private nextGistCounter = 1;
  private nextCommentId = 1;

  constructor(private readonly $: Context$) {}

  private usersContext(): UsersContext {
    return this.$.loadContext("/users") as UsersContext;
  }

  private generateGistId(): string {
    const counter = this.nextGistCounter++;
    return String(counter).padStart(20, "0");
  }

  saveGist(
    gist: Partial<gist_simple> & { files: NonNullable<gist_simple["files"]> },
  ): gist_simple {
    const now = isoNow();
    const id = gist.id ?? this.generateGistId();
    const existing = this.gistsById.get(id);
    const fullGist: gist_simple = {
      ...existing,
      ...gist,
      id,
      node_id: gist.node_id ?? existing?.node_id ?? `G_${id}`,
      url: gist.url ?? existing?.url ?? `${API_URL}/gists/${id}`,
      forks_url:
        gist.forks_url ?? existing?.forks_url ?? `${API_URL}/gists/${id}/forks`,
      commits_url:
        gist.commits_url ??
        existing?.commits_url ??
        `${API_URL}/gists/${id}/commits`,
      git_pull_url:
        gist.git_pull_url ?? existing?.git_pull_url ?? `${GIST_URL}/${id}.git`,
      git_push_url:
        gist.git_push_url ?? existing?.git_push_url ?? `${GIST_URL}/${id}.git`,
      html_url: gist.html_url ?? existing?.html_url ?? `${GIST_URL}/${id}`,
      files: gist.files,
      public: gist.public ?? existing?.public ?? true,
      created_at: existing?.created_at ?? gist.created_at ?? now,
      updated_at: now,
      description: gist.description ?? existing?.description ?? "",
      comments: this.commentsByGistId.get(id)?.size ?? existing?.comments ?? 0,
      user:
        gist.user ??
        existing?.user ??
        this.usersContext().getUser(DEFAULT_USER_LOGIN) ??
        this.usersContext().saveUser({ login: DEFAULT_USER_LOGIN }),
      comments_url:
        gist.comments_url ??
        existing?.comments_url ??
        `${API_URL}/gists/${id}/comments`,
      owner: gist.owner ?? existing?.owner,
      truncated: gist.truncated ?? existing?.truncated ?? false,
    };
    this.gistsById.set(id, fullGist);
    if (gist.id == null) {
      this.nextGistCounter = Math.max(
        this.nextGistCounter,
        Number(id) + 1 || this.nextGistCounter,
      );
    }
    return fullGist;
  }

  getGist(id: string): gist_simple | undefined {
    return this.gistsById.get(id);
  }

  hasGist(id: string): boolean {
    return this.gistsById.has(id);
  }

  deleteGist(id: string): boolean {
    return this.gistsById.delete(id);
  }

  listGists(): gist_simple[] {
    return [...this.gistsById.values()];
  }

  listPublicGists(): gist_simple[] {
    return [...this.gistsById.values()].filter((gist) => gist.public);
  }

  starGist(id: string): void {
    this.starredGistIds.add(id);
  }

  unstarGist(id: string): void {
    this.starredGistIds.delete(id);
  }

  isGistStarred(id: string): boolean {
    return this.starredGistIds.has(id);
  }

  listStarredGists(): gist_simple[] {
    return [...this.gistsById.values()].filter((gist) =>
      this.starredGistIds.has(gist.id ?? ""),
    );
  }

  saveComment(
    gistId: string,
    comment: Partial<gist_comment> & { body: string },
  ): gist_comment {
    const now = isoNow();
    const existing = comment.id
      ? this.commentsByGistId.get(gistId)?.get(comment.id)
      : undefined;
    const id = comment.id ?? this.nextCommentId++;
    const fullComment: gist_comment = {
      id,
      node_id: comment.node_id ?? existing?.node_id ?? `GC_${id}`,
      url:
        comment.url ??
        existing?.url ??
        `${API_URL}/gists/${gistId}/comments/${id}`,
      body: comment.body,
      user:
        comment.user ??
        existing?.user ??
        this.usersContext().getUser(DEFAULT_USER_LOGIN) ??
        this.usersContext().saveUser({ login: DEFAULT_USER_LOGIN }),
      created_at: existing?.created_at ?? comment.created_at ?? now,
      updated_at: now,
      author_association:
        comment.author_association ?? existing?.author_association ?? "NONE",
    };
    if (!this.commentsByGistId.has(gistId)) {
      this.commentsByGistId.set(gistId, new Map());
    }
    this.commentsByGistId.get(gistId)!.set(id, fullComment);
    if (comment.id == null) {
      this.nextCommentId = Math.max(this.nextCommentId, id + 1);
    }

    const gist = this.gistsById.get(gistId);
    if (gist) {
      gist.comments = this.commentsByGistId.get(gistId)!.size;
    }

    return fullComment;
  }

  getComment(gistId: string, commentId: number): gist_comment | undefined {
    return this.commentsByGistId.get(gistId)?.get(commentId);
  }

  hasComment(gistId: string, commentId: number): boolean {
    return this.commentsByGistId.get(gistId)?.has(commentId) ?? false;
  }

  deleteComment(gistId: string, commentId: number): boolean {
    const deleted =
      this.commentsByGistId.get(gistId)?.delete(commentId) ?? false;
    if (deleted) {
      const gist = this.gistsById.get(gistId);
      if (gist) {
        gist.comments = this.commentsByGistId.get(gistId)?.size ?? 0;
      }
    }
    return deleted;
  }

  listComments(gistId: string): gist_comment[] {
    return [...(this.commentsByGistId.get(gistId)?.values() ?? [])];
  }
}
