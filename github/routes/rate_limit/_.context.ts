import type { Context$ } from "../../types/_.context.js";
import type { rate_limit } from "../../types/components/schemas/rate-limit.js";
import type { rate_limit_overview } from "../../types/components/schemas/rate-limit-overview.js";

const ONE_HOUR_FROM_NOW = () => Math.floor(Date.now() / 1000) + 3600;

const DEFAULT_LIMITS: Record<string, rate_limit> = {
  core: { limit: 5000, remaining: 5000, used: 0, reset: ONE_HOUR_FROM_NOW() },
  search: { limit: 30, remaining: 30, used: 0, reset: ONE_HOUR_FROM_NOW() },
  graphql: {
    limit: 5000,
    remaining: 5000,
    used: 0,
    reset: ONE_HOUR_FROM_NOW(),
  },
  code_search: {
    limit: 10,
    remaining: 10,
    used: 0,
    reset: ONE_HOUR_FROM_NOW(),
  },
  integration_manifest: {
    limit: 5000,
    remaining: 5000,
    used: 0,
    reset: ONE_HOUR_FROM_NOW(),
  },
  code_scanning_upload: {
    limit: 1000,
    remaining: 1000,
    used: 0,
    reset: ONE_HOUR_FROM_NOW(),
  },
  actions_runner_registration: {
    limit: 10000,
    remaining: 10000,
    used: 0,
    reset: ONE_HOUR_FROM_NOW(),
  },
  scim: { limit: 15000, remaining: 15000, used: 0, reset: ONE_HOUR_FROM_NOW() },
  dependency_snapshots: {
    limit: 100,
    remaining: 100,
    used: 0,
    reset: ONE_HOUR_FROM_NOW(),
  },
  dependency_sbom: {
    limit: 100,
    remaining: 100,
    used: 0,
    reset: ONE_HOUR_FROM_NOW(),
  },
  code_scanning_autofix: {
    limit: 10,
    remaining: 10,
    used: 0,
    reset: ONE_HOUR_FROM_NOW(),
  },
};

export class Context {
  private readonly limits = new Map<string, rate_limit>();

  constructor(private readonly $: Context$) {}

  setRateLimit(
    resource: string,
    limit: Partial<rate_limit> & { limit: number },
  ): void {
    const reset = limit.reset ?? ONE_HOUR_FROM_NOW();
    const remaining = limit.remaining ?? limit.limit;
    const used = limit.used ?? 0;
    this.limits.set(resource, { limit: limit.limit, remaining, used, reset });
  }

  consumeRequest(resource: string = "core"): void {
    const current = this.getRateLimit(resource);
    if (current.remaining > 0) {
      this.limits.set(resource, {
        ...current,
        remaining: current.remaining - 1,
        used: current.used + 1,
      });
    }
  }

  resetRateLimit(resource: string): void {
    const existing = this.limits.get(resource) ?? DEFAULT_LIMITS[resource];
    if (existing) {
      this.limits.set(resource, {
        ...existing,
        remaining: existing.limit,
        used: 0,
        reset: ONE_HOUR_FROM_NOW(),
      });
    }
  }

  getRateLimit(resource: string): rate_limit {
    return (
      this.limits.get(resource) ??
      DEFAULT_LIMITS[resource] ?? {
        limit: 0,
        remaining: 0,
        used: 0,
        reset: ONE_HOUR_FROM_NOW(),
      }
    );
  }

  getRateLimitOverview(): rate_limit_overview {
    const core = this.getRateLimit("core");
    return {
      resources: {
        core,
        search: this.getRateLimit("search"),
        graphql: this.getRateLimit("graphql"),
        code_search: this.getRateLimit("code_search"),
        integration_manifest: this.getRateLimit("integration_manifest"),
        code_scanning_upload: this.getRateLimit("code_scanning_upload"),
        actions_runner_registration: this.getRateLimit(
          "actions_runner_registration",
        ),
        scim: this.getRateLimit("scim"),
        dependency_snapshots: this.getRateLimit("dependency_snapshots"),
        dependency_sbom: this.getRateLimit("dependency_sbom"),
        code_scanning_autofix: this.getRateLimit("code_scanning_autofix"),
      },
      rate: core,
    };
  }
}
