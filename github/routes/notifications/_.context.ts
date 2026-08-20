import type { Context$ } from "../../types/_.context.js";
import type { minimal_repository } from "../../types/components/schemas/minimal-repository.js";
import type { thread } from "../../types/components/schemas/thread.js";
import type { thread_subscription } from "../../types/components/schemas/thread-subscription.js";

const API_URL = "https://api.github.com";
const DEFAULT_PAGE_SIZE = 30;
const DEFAULT_REASON = "subscribed";
const isoNow = () => new Date().toISOString();

const asNumber = (value: unknown, fallback: number) => {
  const numeric = Number(value);
  return Number.isFinite(numeric) && numeric > 0 ? numeric : fallback;
};

const asBoolean = (value: unknown, fallback: boolean) => {
  if (typeof value === "boolean") return value;
  if (value === "true") return true;
  if (value === "false") return false;
  return fallback;
};

const paginate = <T>(
  items: Array<T>,
  query?: { page?: unknown; per_page?: unknown },
) => {
  const page = asNumber(query?.page, 1);
  const perPage = asNumber(query?.per_page, DEFAULT_PAGE_SIZE);
  return items.slice((page - 1) * perPage, page * perPage);
};

export class Context {
  private notifications = new Map<string, thread>();
  private subscriptions = new Map<string, thread_subscription>();
  private nextNotificationId = 1;

  constructor(private readonly $: Context$) {}

  private project(notification: thread): thread {
    const repositories = this.$.loadContext("/repos") as {
      getRepository?: (owner: string, repo: string) => unknown;
    };
    const repository = repositories.getRepository?.(
      notification.repository.owner.login,
      notification.repository.name,
    );
    return repository
      ? { ...notification, repository: repository as minimal_repository }
      : { ...notification };
  }

  saveNotification(
    input: Partial<thread> & {
      subject: thread["subject"];
      repository: minimal_repository;
    },
  ): thread {
    const now = isoNow();
    const id = input.id ?? String(this.nextNotificationId);
    const numericId = Number(id);
    if (Number.isInteger(numericId) && numericId >= this.nextNotificationId) {
      this.nextNotificationId = numericId + 1;
    } else if (input.id === undefined) {
      this.nextNotificationId += 1;
    }

    const existing = this.notifications.get(id);
    const notification: thread = {
      ...existing,
      ...input,
      id,
      reason: input.reason ?? existing?.reason ?? DEFAULT_REASON,
      unread: input.unread ?? existing?.unread ?? true,
      updated_at: input.updated_at ?? existing?.updated_at ?? now,
      last_read_at: input.last_read_at ?? existing?.last_read_at ?? now,
      url:
        input.url ?? existing?.url ?? `${API_URL}/notifications/threads/${id}`,
      subscription_url:
        input.subscription_url ??
        existing?.subscription_url ??
        `${API_URL}/notifications/threads/${id}/subscription`,
    };
    this.notifications.set(id, notification);
    return notification;
  }

  getNotification(id: string): thread | undefined {
    const notification = this.notifications.get(id);
    return notification ? this.project(notification) : undefined;
  }

  markNotificationRead(id: string, transitionAt: string = isoNow()): boolean {
    const notification = this.notifications.get(id);
    if (!notification) return false;
    this.notifications.set(id, {
      ...notification,
      unread: false,
      last_read_at: transitionAt,
    });
    return true;
  }

  markNotificationDone(id: string): boolean {
    const deleted = this.notifications.delete(id);
    this.subscriptions.delete(id);
    return deleted;
  }

  markAllNotificationsRead(
    owner?: string,
    repo?: string,
    input: { last_read_at?: string; read?: boolean } = {},
  ): void {
    const transitionAt = input.last_read_at ?? isoNow();
    const cutoff = input.last_read_at
      ? new Date(input.last_read_at).getTime()
      : Number.POSITIVE_INFINITY;
    for (const notification of this.notifications.values()) {
      if (owner && notification.repository.owner.login !== owner) continue;
      if (repo && notification.repository.name !== repo) continue;
      if (new Date(notification.updated_at).getTime() >= cutoff) continue;
      if (input.read ?? true) {
        this.markNotificationRead(notification.id, transitionAt);
      } else {
        this.notifications.set(notification.id, {
          ...notification,
          unread: true,
        });
      }
    }
  }

  listNotifications(query?: {
    all?: unknown;
    participating?: unknown;
    per_page?: unknown;
    page?: unknown;
    owner?: string;
    repo?: string;
    since?: string;
    before?: string;
  }): thread[] {
    const includeRead = asBoolean(query?.all, false);
    const participating = asBoolean(query?.participating, false);
    const since = query?.since ? new Date(query.since).getTime() : undefined;
    const before = query?.before ? new Date(query.before).getTime() : undefined;
    const filtered = [...this.notifications.values()]
      .map((notification) => this.project(notification))
      .filter((notification) => includeRead || notification.unread)
      .filter(
        (notification) =>
          since === undefined ||
          new Date(notification.updated_at).getTime() > since,
      )
      .filter(
        (notification) =>
          before === undefined ||
          new Date(notification.updated_at).getTime() < before,
      )
      .filter(
        (notification) =>
          !query?.owner || notification.repository.owner.login === query.owner,
      )
      .filter(
        (notification) =>
          !query?.repo || notification.repository.name === query.repo,
      )
      .filter(
        (notification) =>
          !participating || notification.reason !== DEFAULT_REASON,
      )
      .sort((left, right) => right.updated_at.localeCompare(left.updated_at));
    return paginate(filtered, query);
  }

  getThreadSubscription(threadId: string): thread_subscription | undefined {
    return this.subscriptions.get(threadId);
  }

  listSubscribedSubjectUrls(): string[] {
    return [...this.subscriptions.entries()]
      .filter(([, subscription]) => subscription.subscribed)
      .map(([threadId]) => this.notifications.get(threadId)?.subject.url)
      .filter((url): url is string => Boolean(url));
  }

  setThreadSubscription(
    threadId: string,
    input: { ignored?: boolean },
  ): thread_subscription {
    const existing = this.subscriptions.get(threadId);
    const ignored = input.ignored ?? existing?.ignored ?? false;
    const subscription: thread_subscription = {
      subscribed: !ignored,
      ignored,
      reason: existing?.reason ?? DEFAULT_REASON,
      created_at: existing?.created_at ?? isoNow(),
      url: `${API_URL}/notifications/threads/${threadId}/subscription`,
      thread_url: `${API_URL}/notifications/threads/${threadId}`,
      repository_url:
        this.notifications.get(threadId)?.repository.url ??
        existing?.repository_url,
    };
    this.subscriptions.set(threadId, subscription);
    return subscription;
  }

  deleteThreadSubscription(threadId: string): boolean {
    return this.subscriptions.delete(threadId);
  }
}
