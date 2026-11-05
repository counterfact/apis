import type { GetConvAISettingsResponseModel as Settings } from "../../../types/v1/components/schemas/GetConvAISettingsResponseModel.js";
import type { GetConvAIDashboardSettingsResponseModel as Dashboard } from "../../../types/v1/components/schemas/GetConvAIDashboardSettingsResponseModel.js";

type Result<T> = { value: T; error?: never } | { error: "invalid_settings"; value?: never };
type RecordValue = Record<string, unknown>;
const object = (value: unknown): value is RecordValue => value !== null && typeof value === "object" && !Array.isArray(value);
const keys = (value: RecordValue, allowed: string[]) => Object.keys(value).every(key => allowed.includes(key));
const integer = (value: unknown, max: number) => Number.isInteger(value) && Number(value) > 0 && Number(value) <= max;
const eventTypes = ["transcript", "audio", "call_initiation_failure", "answering_machine_detection", "unredacted_transcript", "unredacted_audio"];

export class Context {
  settings: Settings = {};
  dashboard: Dashboard = {};

  getSettings(): Settings { return structuredClone(this.settings); }
  getDashboard(): Dashboard { return structuredClone(this.dashboard); }

  updateSettings(input: unknown): Result<Settings> {
    if (!validSettings(input)) return { error: "invalid_settings" };
    // Omitted fields preserve state. Only webhooks has independently patchable fields.
    const patch = structuredClone(input) as Settings;
    this.settings = { ...this.settings, ...patch,
      ...(patch.webhooks === undefined ? {} : { webhooks: { ...this.settings.webhooks, ...patch.webhooks } }) };
    return { value: this.getSettings() };
  }

  updateDashboard(input: unknown): Result<Dashboard> {
    if (!object(input) || !keys(input, ["charts"]) ||
      (input.charts !== undefined && (!Array.isArray(input.charts) || input.charts.length > 4 || !input.charts.every(validChart)))) {
      return { error: "invalid_settings" };
    }
    this.dashboard = { ...this.dashboard, ...structuredClone(input) as Dashboard };
    return { value: this.getDashboard() };
  }
}

function validSettings(input: unknown): input is RecordValue {
  if (!object(input) || !keys(input, ["conversation_initiation_client_data_webhook", "webhooks", "can_use_mcp_servers", "rag_retention_period_days", "conversation_embedding_retention_days", "default_livekit_stack"])) return false;
  return Object.entries(input).every(([key, value]) => {
    switch (key) {
      case "can_use_mcp_servers": return typeof value === "boolean";
      case "rag_retention_period_days": return integer(value, 30);
      case "conversation_embedding_retention_days": return value === null || integer(value, 365);
      case "default_livekit_stack": return value === "standard" || value === "static";
      case "conversation_initiation_client_data_webhook": return value === null || validInitiationWebhook(value);
      case "webhooks": return validWebhooks(value);
      default: return false;
    }
  });
}

function validInitiationWebhook(value: unknown) {
  return object(value) && keys(value, ["url", "request_headers"]) && typeof value.url === "string" && object(value.request_headers) &&
    Object.values(value.request_headers).every(header => typeof header === "string" || (object(header) &&
      ((keys(header, ["secret_id"]) && typeof header.secret_id === "string") ||
       (keys(header, ["env_var_label"]) && typeof header.env_var_label === "string"))));
}

function validWebhooks(value: unknown) {
  return object(value) && keys(value, ["post_call_webhook_id", "events", "transcript_format", "exclude_transcript", "send_audio"]) &&
    Object.entries(value).every(([key, item]) => {
      switch (key) {
        case "post_call_webhook_id": return item === null || typeof item === "string";
        case "send_audio": return item === null || typeof item === "boolean";
        case "exclude_transcript": return typeof item === "boolean";
        case "transcript_format": return item === "json" || item === "opentelemetry";
        case "events": return Array.isArray(item) && item.every(event => typeof event === "string" && eventTypes.includes(event));
        default: return false;
      }
    });
}

function validChart(value: unknown) {
  if (!object(value) || typeof value.name !== "string") return false;
  switch (value.type) {
    case "call_success": return keys(value, ["name", "type"]);
    case "criteria": return keys(value, ["name", "type", "criteria_id"]) && typeof value.criteria_id === "string";
    case "data_collection": return keys(value, ["name", "type", "data_collection_id"]) && typeof value.data_collection_id === "string";
    default: return false;
  }
}
