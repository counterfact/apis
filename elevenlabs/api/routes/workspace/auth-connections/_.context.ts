import type { CreateBasicAuthRequest } from "../../../types/v1/components/schemas/CreateBasicAuthRequest.js";
import type { CreateBearerAuthRequest } from "../../../types/v1/components/schemas/CreateBearerAuthRequest.js";
import type { CreateOAuth2ClientCredsRequest } from "../../../types/v1/components/schemas/CreateOAuth2ClientCredsRequest.js";

type Basic = CreateBasicAuthRequest & { auth_type: "basic_auth"; id: string };
type Bearer = CreateBearerAuthRequest & { auth_type: "bearer_auth"; id: string };
type OAuth = CreateOAuth2ClientCredsRequest & { auth_type: "oauth2_client_credentials"; id: string };
type Configuration = Basic | Bearer | OAuth;
type AuthType = Configuration["auth_type"];
type Validator = (value: unknown) => boolean;
const string: Validator = (value) => typeof value === "string";
const strings: Validator = (value) => Array.isArray(value) && value.every(string);
const object = (value: unknown): value is Record<string, unknown> => value !== null && typeof value === "object" && !Array.isArray(value);
const stringMap: Validator = (value) => object(value) && Object.values(value).every(string);
const fields: Record<AuthType, Record<string, Validator>> = {
  basic_auth: { provider: string, username: string, password: string },
  bearer_auth: { provider: string, token: string },
  oauth2_client_credentials: { provider: string, client_id: string, client_secret: string, scopes: strings,
    extra_params: stringMap, custom_headers: stringMap, basic_auth_in_header: (value) => typeof value === "boolean" },
};
const required: Record<AuthType, string[]> = {
  basic_auth: ["provider", "username", "password"], bearer_auth: ["provider", "token"],
  oauth2_client_credentials: ["provider", "client_id", "client_secret", "token_url"],
};

export class AuthConnectionError extends Error {
  override name = "AuthConnectionError";
}
const invalid = (): never => { throw new AuthConnectionError("Unsupported or invalid auth connection configuration"); };
const supported = (value: unknown): value is AuthType => typeof value === "string" && Object.hasOwn(fields, value);

function validate(input: unknown, authType: AuthType, creating: boolean): Record<string, unknown> {
  if (!object(input)) return invalid();
  const validators: Record<string, Validator> = { ...fields[authType], auth_type: (value) => value === authType,
    ...(creating ? { name: string, ...(authType === "oauth2_client_credentials" ? { token_url: string } : {}) } : {}) };
  for (const [key, value] of Object.entries(input)) {
    if (!Object.hasOwn(validators, key)) return invalid();
    // Null optional PATCH fields preserve existing values; auth_type itself is never nullable.
    if (!creating && key !== "auth_type" && value === null) continue;
    if (!validators[key](value)) return invalid();
  }
  if (creating && ["name", ...required[authType]].some((key) => !Object.hasOwn(input, key))) return invalid();
  return input;
}

function publicConnection(stored: Configuration) {
  const common = { id: stored.id, name: stored.name, provider: stored.provider, status: "active" as const };
  switch (stored.auth_type) {
    case "basic_auth": return { ...common, auth_type: stored.auth_type, username: stored.username };
    case "bearer_auth": return { ...common, auth_type: stored.auth_type };
    case "oauth2_client_credentials": return structuredClone({ ...common, auth_type: stored.auth_type,
      client_id: stored.client_id, token_url: stored.token_url, scopes: stored.scopes ?? [],
      extra_params: stored.extra_params ?? {}, basic_auth_in_header: stored.basic_auth_in_header ?? false,
      custom_headers: stored.custom_headers ?? {} });
  }
}

export class Context {
  authConnections = new Map<string, Configuration>();
  nextAuthConnectionNumber = 0;

  listAuthConnections() {
    return { auth_connections: [...this.authConnections.values()].map(publicConnection) };
  }

  createAuthConnection(input: unknown) {
    if (!object(input)) return invalid();
    let authType = input.auth_type;
    if (authType === undefined) {
      // Infer only a unique complete schema family, including its allowed fields.
      const matches = (Object.keys(fields) as AuthType[]).filter((candidate) => {
        try { validate(input, candidate, true); return true; } catch (error) {
          if (error instanceof AuthConnectionError) return false;
          throw error;
        }
      });
      if (matches.length !== 1) return invalid();
      authType = matches[0];
    }
    if (!supported(authType)) return invalid();
    validate(input, authType, true);
    let id: string;
    do { id = `sim-auth-connection-created-${++this.nextAuthConnectionNumber}`; } while (this.authConnections.has(id));
    // Runtime validation above establishes this discriminated request shape.
    const stored = structuredClone({ ...input, auth_type: authType, id }) as Configuration;
    this.authConnections.set(id, stored);
    return publicConnection(stored);
  }

  updateAuthConnection(id: string, input: unknown) {
    const stored = this.authConnections.get(id);
    if (!stored) return undefined;
    const patch = validate(input, stored.auth_type, false);
    const replacement = structuredClone({ ...stored,
      ...Object.fromEntries(Object.entries(patch).filter(([, value]) => value !== null)) }) as Configuration;
    this.authConnections.set(id, replacement);
    return publicConnection(replacement);
  }

  deleteAuthConnection(id: string) {
    return this.authConnections.delete(id) ? { status: "ok" } : undefined;
  }
}
