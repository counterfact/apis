/**
 * Request-time processing tier for a model.
 *
 * STANDARD: default price and throughput.
 * FAST: pays a per-token price premium for higher throughput / lower latency.
 *     See OpenAI's fast mode: https://openai.com/api-fast-mode/
 * @default "standard"
 */
export type LLMServiceTier = "standard" | "fast";
