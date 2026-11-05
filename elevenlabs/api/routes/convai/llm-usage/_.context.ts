import type { Context as Agents } from "../agents/_.context.js";
import type { Context as Catalog } from "../llm/_.context.js";
import type { LLM } from "../../../types/v1/components/schemas/LLM.js";
import type { LLMUsageCalculatorResponseModel as Estimate } from "../../../types/v1/components/schemas/LLMUsageCalculatorResponseModel.js";

export type Rate = {
  inputPerMillion: number;
  outputPerMillion: number;
  fastMultiplier: number;
};
export class UsageError extends Error {
  override name = "UsageError";
  constructor(
    public status: number,
    public code: string,
  ) {
    super(code);
  }
}
const fail = (status: number, code: string): never => {
  throw new UsageError(status, code);
};
const invalid = (): never => fail(400, "invalid_llm_usage_request");
const object = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);
const round = (v: number) => Math.round(v * 1e9) / 1e9;

export class Context {
  rates = new Map<LLM, Rate>();
  assumptions?: {
    charactersPerToken: number;
    tokensPerPage: number;
    ragPages: number;
    outputTokens: number;
    messagesPerMinute: number;
  };
  agents?: () => Agents;
  catalog?: () => Catalog;
  pages?: (agentId: string) => number;

  private input(value: unknown, optional: boolean) {
    if (
      !object(value) ||
      Object.keys(value).some(
        (k) =>
          ![
            "prompt_length",
            "number_of_pages",
            "rag_enabled",
            "service_tier",
          ].includes(k),
      )
    )
      return invalid();
    for (const key of ["prompt_length", "number_of_pages"]) {
      if (optional && value[key] == null) continue;
      if (
        typeof value[key] !== "number" ||
        !Number.isSafeInteger(value[key]) ||
        Number(value[key]) < 0
      )
        return invalid();
    }
    if (
      !(optional && value.rag_enabled == null) &&
      typeof value.rag_enabled !== "boolean"
    )
      return invalid();
    if (
      value.service_tier != null &&
      (typeof value.service_tier !== "string" ||
        !["standard", "fast"].includes(value.service_tier))
    )
      return invalid();
    return value;
  }

  calculate(input: unknown): Estimate {
    const body = this.input(input, false),
      a = this.assumptions;
    if (!a || !this.catalog) throw new Error("Run startup or reset");
    const pages = body.rag_enabled
      ? Math.min(Number(body.number_of_pages), a.ragPages)
      : Number(body.number_of_pages);
    const tokens =
      Math.ceil(Number(body.prompt_length) / a.charactersPerToken) +
      pages * a.tokensPerPage;
    const llm_prices = [...this.catalog().models.values()].map((model) => {
      const rate = this.rates.get(model.llm);
      if (!rate) return fail(400, "llm_rate_unavailable");
      const multiplier =
        body.service_tier === "fast" &&
        model.available_service_tiers?.includes("fast")
          ? rate.fastMultiplier
          : 1;
      const cost =
        ((tokens * rate.inputPerMillion +
          a.outputTokens * rate.outputPerMillion) /
          1e6) *
        multiplier;
      return {
        llm: model.llm,
        price_per_message: round(cost),
        price_per_minute: round(cost * a.messagesPerMinute),
      };
    });
    return { llm_prices };
  }

  forAgent(id: string, input: unknown): Estimate {
    const agent = this.agents?.().getAgent(id);
    if (!agent) return fail(404, "agent_not_found");
    const body = this.input(input, true),
      prompt = agent.conversation_config.agent?.prompt;
    if (!this.pages) throw new Error("Run startup or reset");
    return this.calculate({
      prompt_length:
        body.prompt_length ?? Array.from(prompt?.prompt ?? "").length,
      number_of_pages: body.number_of_pages ?? this.pages(id),
      rag_enabled: body.rag_enabled ?? prompt?.rag?.enabled ?? false,
      service_tier: body.service_tier ?? prompt?.service_tier ?? "standard",
    });
  }
}
