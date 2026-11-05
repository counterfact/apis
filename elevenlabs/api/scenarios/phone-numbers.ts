import type { Scenario } from "../types/index.js";
export const emptyPhoneNumbers: Scenario = ($) => {
  const context = $.loadContext("/convai/phone-numbers");
  context.phones = new Map();
  context.sipMessages = new Map();
  context.nextPhoneNumber = 0;
  context.agent = id => $.loadContext("/convai/agents").agents.get(id)?.configuration;
  $.loadContext("/convai/v2").phoneNumbers = context;
};
export const resetPhoneNumbers: Scenario = ($) => {
  emptyPhoneNumbers($);
  const context = $.loadContext("/convai/phone-numbers");
  context.phones = new Map([
    ["sim-phone-twilio", { public: { phone_number_id: "sim-phone-twilio", phone_number: "+15005550001", label: "Simulator Support", provider: "twilio", supports_inbound: true, supports_outbound: true } }],
    ["sim-phone-sip", { public: { phone_number_id: "sim-phone-sip", phone_number: "+15005550002", label: "Simulator SIP", provider: "sip_trunk", supports_inbound: true, supports_outbound: false, livekit_stack: "standard", store_sip_messages: true, inbound_trunk: { allowed_addresses: ["192.0.2.0/24"], allowed_numbers: null, media_encryption: "allowed", has_auth_credentials: false }, outbound_trunk: null, provider_config: null } }],
  ]);
  context.sipMessages = new Map([["sim-phone-sip", [
    { call_id: "sim-call-2", phone_numbers: ["+15005550002"], local_address: "192.0.2.10:5060", remote_address: "198.51.100.10:5060", transport: "udp", raw_message: "SIP/2.0 200 OK\r\n", error_message: "", direction: "out", created_at_unix_micro: 1_735_689_602_000_000 },
    { call_id: "sim-call-1", phone_numbers: ["+15005550002"], local_address: "192.0.2.10:5060", remote_address: "198.51.100.10:5060", transport: "udp", raw_message: "INVITE sip:sim@example.invalid SIP/2.0\r\n", error_message: "", direction: "in", created_at_unix_micro: 1_735_689_601_000_000 },
  ]]]);
};
