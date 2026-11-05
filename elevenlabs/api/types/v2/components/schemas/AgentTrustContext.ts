/**
 * The trust context in which the agent operates.
 *
 * UNKNOWN: not yet classified (existing agents created before this feature).
 * LOW: serves untrusted external participants (e.g. customer support, sales) —
 *      outputs should be vetted and tool access scoped.
 * HIGH: serves the owner (e.g. personal assistant) — full tool access is appropriate.
 * @default "unknown"
 */
export type AgentTrustContext = "unknown" | "low" | "high";
