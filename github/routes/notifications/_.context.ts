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
  if (typeof value === "string") {
    if (value === "true") return true;
    if (value === "false") return false;
  }
  return fallback;
};

const paginate = <T>(
  items: Array<T>,
  query?: { page?: unknown; per_page?: unknown },
) => {
  const page = asNumber(query?.page, 1);
  const perPage = asNumber(query?.per_page, DEFAULT_PAGE_SIZE);
  const start = (page - 1) * perPage;
  return items.slice(start, start + perPage);
};

export class Context {
  private notifications = new Map<string, thread>();
  private subscriptions = new Map<string, thread_subscription>();
  private nextNotificationId = 1;

  constructor(private readonly $: Context$) {}

  saveNotification(
    input: Partial<thread> & {
      subject: thread["subject"];
      repository: minimal_repository;
    },
  ): thread {
    const now = isoNow();
    const id = input.id ?? String(this.nextNotificationId++);
    const existing = this.notifications.get(id);
    const fullNotification: thread = {
      ...existing,
      ...input,
      id,
      reason: input.reason ?? existing?.reason ?? DEFAULT_REASON,
      unread: true,
      updated_at: now,
      last_read_at: input.last_read_at ?? existing?.last_read_at ?? now,
      url: input.url ?? existing?.url ?? `${API_URL}/notifications/threads/${id}`,
      subscription_url:
        input.subscription_url ??
        existing?.subscription_url ??
        `${API_URL}/notifications/threads/${id}/subscription`,
    };
    this.notifications.set(id, fullNotification);
    if (input.id == null) {
      this.nextNotificationId = Math.max(
        this.nextNotificationId,
        Number(id) + 1 || this.nextNotificationId,
      );
    }
    return fullNotification;
  }

  getNotification(id: string): thread | undefined {
    return this.notifications.get(id);
  }

  markNotificationRead(id: string): boolean {
    const notification = this.notifications.get(id);
    if (!notification) return false;
    this.notifications.set(id, {
      ...notification,
      unread: false,
      last_read_at: isoNow(),
      updated_at: isoNow(),
    });
    return true;
  }

  markNotificationDone(id: string): boolean {
    const deleted = this.notifications.delete(id);
    this.subscriptions.delete(id);
    return deleted;
  }

  markAllNotificationsRead(owner?: string, repo?: string): void {
    for (const notification of this.notifications.values()) {
      if (
        (owner && notification.repository.owner.login !== owner) ||
        (repo && notification.repository.name !== repo)
      ) {
        continue;
      }
      this.markNotificationRead(notification.id);
    }
  }

  listNotifications(query?: {
    all?: unknown;
    participating?: unknown;
    per_page?: unknown;
    page?: unknown;
    owner?: string;
    repo?: string;
  }): thread[] {
    const includeRead = asBoolean(query?.all, false);
    const participating = asBoolean(query?.participating, false);
    const filtered = [...this.notifications.values()]
      .filter((notification) => includeRead || notification.unread)
      .filter((notification) =>
        query?.owner
          ? notification.repository.owner.login === query.owner
          : true,
      )
      .filter((notification) =>
        query?.repo ? notification.repository.name === query.repo : true,
      )
      .filter((notification) =>
        participating ? notification.reason === DEFAULT_REASON : true,
      )
      .sort((left, right) => right.updated_at.localeCompare(left.updated_at));
    return paginate(filtered, query);
  }

  getThreadSubscription(threadId: string): thread_subscription | undefined {
    return this.subscriptions.get(threadId);
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
