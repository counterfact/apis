import type { GetPhoneNumberTwilioResponseModel as Twilio } from "../../../types/v1/components/schemas/GetPhoneNumberTwilioResponseModel.js";
import type { GetPhoneNumberExotelResponseModel as Exotel } from "../../../types/v1/components/schemas/GetPhoneNumberExotelResponseModel.js";
import type { GetPhoneNumberSIPTrunkResponseModel as SIP } from "../../../types/v1/components/schemas/GetPhoneNumberSIPTrunkResponseModel.js";
import type { SIPLogMessage } from "../../../types/v1/components/schemas/SIPLogMessage.js";
import type { GetAgentResponseModel } from "../../../types/v1/components/schemas/GetAgentResponseModel.js";
import type { HTTP_GET_Query as PageQuery } from "../../../types/v1/paths/convai/v2/phone-numbers.types.js";
import type { HTTP_GET_Query as ListQuery } from "../../../types/v1/paths/convai/phone-numbers.types.js";

type Phone = (Twilio & {provider: "twilio"}) | (Exotel & {provider: "exotel"}) | (SIP & {provider: "sip_trunk"});
type StoredPhone = { public: Phone; agentId?: string | null; environment?: string | null; branchId?: string | null };
type ObjectValue = Record<string, unknown>;
const object = (value: unknown): value is ObjectValue => value !== null && typeof value === "object" && !Array.isArray(value);
const text = (value: unknown): value is string => typeof value === "string" && !!value.trim();
const optionalText = (value: unknown) => value == null || text(value);
const keys = (value: ObjectValue, allowed: string[]) => Object.keys(value).every(key => allowed.includes(key));
const strings = (value: unknown): value is string[] => Array.isArray(value) && value.every(v => typeof v === "string");
const stringMap = (value: unknown) => object(value) && Object.values(value).every(v => typeof v === "string");
export class PhoneError extends Error {
  override name = "PhoneError";
  constructor(public status: number, public code: string, message: string) { super(message); }
}
const invalid = (): never => { throw new PhoneError(400, "invalid_phone_configuration", "Invalid or unsupported phone configuration"); };
const numberPattern = /^\+[1-9]\d{6,14}$/;
const page = <T>(items: T[], size: number, cursor: unknown, max: number) => {
  if (!Number.isSafeInteger(size) || size < 1 || size > max || (cursor != null && (typeof cursor !== "string" || !/^\d+$/.test(cursor) || !Number.isSafeInteger(Number(cursor))))) return invalid();
  const offset = cursor == null ? 0 : Number(cursor);
  const end = offset + size;
  return { values: structuredClone(items.slice(offset, end)), next_cursor: end < items.length ? String(end) : null, has_more: end < items.length };
};
function trunk(value: unknown, outbound: boolean, prior?: SIP["outbound_trunk"] | SIP["inbound_trunk"]) {
  if (value === null) return null;
  if (!object(value) || !keys(value, outbound ? ["address", "transport", "media_encryption", "headers", "attributes_to_headers", "credentials", "enabled_codecs"] : ["allowed_addresses", "allowed_numbers", "media_encryption", "credentials", "remote_domains", "attributes_to_headers"])) return invalid();
  if (outbound && (!text(value.address) || value.transport !== undefined && !["auto", "udp", "tcp", "tls"].includes(String(value.transport)))) return invalid();
  if (value.media_encryption !== undefined && !["disabled", "allowed", "required"].includes(String(value.media_encryption))) return invalid();
  for (const key of ["headers", "attributes_to_headers"]) if (value[key] !== undefined && !stringMap(value[key])) return invalid();
  for (const key of ["allowed_addresses", "allowed_numbers", "remote_domains"]) if (value[key] != null && !strings(value[key])) return invalid();
  if (value.enabled_codecs !== undefined && (!strings(value.enabled_codecs) || !value.enabled_codecs.every(codec => ["G722/8000", "PCMU/8000", "PCMA/8000"].includes(codec)))) return invalid();
  const credentials = value.credentials;
  if (credentials != null && (!object(credentials) || !keys(credentials, ["username", "password"]) || !text(credentials.username) || credentials.password != null && !text(credentials.password))) return invalid();
  const hasAuth = credentials === null ? false : object(credentials) && credentials.password != null ? true : !!prior?.has_auth_credentials;
  const username = credentials === null ? null : object(credentials) ? credentials.username as string : prior?.username ?? null;
  const common = { media_encryption: (value.media_encryption ?? "allowed") as "disabled" | "allowed" | "required", has_auth_credentials: hasAuth, username, attributes_to_headers: structuredClone(value.attributes_to_headers ?? {}) as Record<string, string> };
  return outbound ? { ...common, address: value.address as string, transport: (value.transport ?? "auto") as "auto" | "udp" | "tcp" | "tls", headers: structuredClone(value.headers ?? {}) as Record<string,string>, enabled_codecs: structuredClone(value.enabled_codecs ?? []) as Array<"G722/8000" | "PCMU/8000" | "PCMA/8000">, has_outbound_trunk: true } : { ...common, allowed_addresses: structuredClone(value.allowed_addresses ?? []) as string[], allowed_numbers: structuredClone(value.allowed_numbers ?? null) as string[] | null, remote_domains: structuredClone(value.remote_domains ?? null) as string[] | null };
}
export class Context {
  phones = new Map<string, StoredPhone>();
  sipMessages = new Map<string, SIPLogMessage[]>();
  nextPhoneNumber = 0;
  agent: (id: string) => GetAgentResponseModel | undefined = () => undefined;

  private stored(id: string) {
    const value = this.phones.get(id);
    if (!value) throw new PhoneError(404, "phone_number_not_found", "Phone number not found");
    return value;
  }
  private projection(record: StoredPhone): Phone {
    const result = structuredClone(record.public);
    const agent = record.agentId ? this.agent(record.agentId) : undefined;
    result.assigned_agent = agent ? { agent_id: agent.agent_id, agent_name: agent.name, environment: record.environment ?? null, branch_id: record.branchId ?? null } : null;
    return result;
  }
  getPhone(id: string) { return this.projection(this.stored(id)); }
  listPhones(query: ListQuery = {}) {
    if (query.provider != null && !["twilio", "exotel", "sip_trunk"].includes(query.provider)) return invalid();
    if (!optionalText(query.agent_id) || !optionalText(query.branch_id)) return invalid();
    return [...this.phones.values()].map(record => this.projection(record)).filter(phone =>
      (query.provider == null || phone.provider === query.provider) &&
      (query.agent_id == null || phone.assigned_agent?.agent_id === query.agent_id) &&
      (query.branch_id == null || phone.assigned_agent?.branch_id === query.branch_id));
  }
  listPhonePage(query: PageQuery = {}) {
    let outbound: boolean | undefined;
    const raw: unknown = query.supports_outbound;
    if (raw != null) {
      if (typeof raw === "boolean") outbound = raw;
      else return invalid();
    }
    for (const field of [query.search, query.label, query.phone_number]) if (field != null && (typeof field !== "string" || field.length > 100)) return invalid();
    if (query.sort_by != null && !["label", "phone_number"].includes(query.sort_by) || query.sort_direction != null && !["asc", "desc"].includes(query.sort_direction)) return invalid();
    const contains = (value: string, needle: string) => value.toLowerCase().includes(needle.toLowerCase());
    const values = this.listPhones(query).filter(phone => (outbound === undefined || phone.supports_outbound === outbound) &&
      (query.label == null || contains(phone.label, query.label)) && (query.phone_number == null || contains(phone.phone_number, query.phone_number)) &&
      (query.search == null || phone.phone_number_id === query.search || contains(phone.label, query.search) || contains(phone.phone_number, query.search)));
    const field = query.sort_by ?? "label", direction = query.sort_direction === "desc" ? -1 : 1;
    values.sort((a,b) => direction * (a[field] < b[field] ? -1 : a[field] > b[field] ? 1 : 0) || a.phone_number_id.localeCompare(b.phone_number_id));
    const result = page(values, query.page_size ?? 100, query.cursor, 1000);
    return { phone_numbers: result.values, next_cursor: result.next_cursor, has_more: result.has_more };
  }
  createPhone(input: unknown) {
    if (!object(input) || !text(input.phone_number) || !numberPattern.test(input.phone_number) || !text(input.label)) return invalid();
    const provider = input.provider ?? (input.sid !== undefined ? "twilio" : input.account_sid !== undefined ? "exotel" : "sip_trunk");
    const common = ["phone_number", "label", "provider", "supports_inbound", "supports_outbound", "agent_id"];
    const fields = provider === "twilio" ? ["sid", "token", "account_auth_token", "region_config", "enable_sms"] : provider === "exotel" ? ["account_sid", "api_key", "api_token", "api_subdomain", "app_id", "applet_url"] : provider === "sip_trunk" ? ["inbound_trunk_config", "outbound_trunk_config"] : invalid();
    if (!keys(input, [...common, ...fields])) return invalid();
    for (const field of ["supports_inbound", "supports_outbound", "enable_sms"]) if (input[field] !== undefined && typeof input[field] !== "boolean") return invalid();
    if (!optionalText(input.agent_id) || input.agent_id && !this.agent(input.agent_id as string)) return invalid();
    if (provider === "twilio" && (!text(input.sid) || !text(input.token) || !optionalText(input.account_auth_token))) return invalid();
    if (provider === "twilio" && input.region_config != null) return invalid(); // Region routing is outside the local simulator.
    if (provider === "exotel" && (!["account_sid", "api_key", "api_token", "app_id"].every(key => text(input[key])) || !["api.in.exotel.com", "api.exotel.com"].includes(String(input.api_subdomain)) || !optionalText(input.applet_url))) return invalid();
    const inbound = input.inbound_trunk_config === undefined ? null : trunk(input.inbound_trunk_config, false);
    const outbound = input.outbound_trunk_config === undefined ? null : trunk(input.outbound_trunk_config, true);
    if ([...this.phones.values()].some(phone => phone.public.phone_number === input.phone_number)) throw new PhoneError(409, "phone_number_already_exists", "Phone number is already imported");
    let id: string; do { id = `sim-phone-created-${++this.nextPhoneNumber}`; } while (this.phones.has(id));
    const base = { phone_number_id: id, phone_number: input.phone_number, label: input.label, supports_inbound: input.supports_inbound ?? true, supports_outbound: input.supports_outbound ?? true, provider };
    const value = provider === "sip_trunk" ? { ...base, livekit_stack: "standard", inbound_trunk: inbound, outbound_trunk: outbound, provider_config: outbound, store_sip_messages: true } : base;
    this.phones.set(id, { public: value as Phone, agentId: input.agent_id as string | null | undefined });
    return { phone_number_id: id };
  }
  updatePhone(id: string, input: unknown) {
    const record = this.stored(id);
    if (!object(input) || !keys(input, ["agent_id", "label", "inbound_trunk_config", "outbound_trunk_config", "livekit_stack", "store_sip_messages", "environment", "branch_id"])) return invalid();
    for (const field of ["agent_id", "label", "environment", "branch_id"]) if (!optionalText(input[field])) return invalid();
    if (input.agent_id && !this.agent(input.agent_id as string)) return invalid();
    const next = structuredClone(record);
    if ("agent_id" in input) next.agentId = input.agent_id as string | null;
    for (const field of ["environment", "branch_id"] as const) if (field in input) {
      if (input[field] != null && !next.agentId) return invalid();
      if (field === "environment") next.environment = input[field] as string | null;
      else next.branchId = input[field] as string | null;
    }
    if (input.agent_id === null) { next.environment = null; next.branchId = null; }
    if (input.label != null) next.public.label = input.label as string;
    const sipKeys = ["inbound_trunk_config", "outbound_trunk_config", "livekit_stack", "store_sip_messages"];
    if (sipKeys.some(key => input[key] != null) && next.public.provider !== "sip_trunk") return invalid();
    if (next.public.provider === "sip_trunk") {
      if (input.livekit_stack != null) { if (!["standard", "static"].includes(String(input.livekit_stack))) return invalid(); next.public.livekit_stack = input.livekit_stack as "standard" | "static"; }
      if (input.store_sip_messages != null) { if (typeof input.store_sip_messages !== "boolean") return invalid(); next.public.store_sip_messages = input.store_sip_messages; }
      if ("inbound_trunk_config" in input) next.public.inbound_trunk = trunk(input.inbound_trunk_config, false, next.public.inbound_trunk) as SIP["inbound_trunk"];
      if ("outbound_trunk_config" in input) { next.public.outbound_trunk = trunk(input.outbound_trunk_config, true, next.public.outbound_trunk) as SIP["outbound_trunk"]; next.public.provider_config = structuredClone(next.public.outbound_trunk); }
    }
    this.phones.set(id, next);
    return this.projection(next);
  }
  deletePhone(id: string) { this.stored(id); this.phones.delete(id); this.sipMessages.delete(id); return {}; }
  listSipMessages(id: string, query: {page_size?: number; cursor?: string | null} = {}) {
    this.stored(id);
    const values = [...(this.sipMessages.get(id) ?? [])].sort((a,b) => b.created_at_unix_micro - a.created_at_unix_micro || a.call_id.localeCompare(b.call_id));
    const result = page(values, query.page_size ?? 20, query.cursor, 20);
    return { sip_messages: result.values, next_cursor: result.next_cursor, has_more: result.has_more };
  }
}
