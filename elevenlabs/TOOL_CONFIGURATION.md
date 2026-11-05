# Tool configuration mutations

`POST /v1/convai/tools` creates a workspace tool.
`PATCH /v1/convai/tools/{tool_id}` replaces its complete `tool_config`; the contract requires this field even for PATCH.
Both accept ordinary client and webhook configurations and return the stored configuration with default timeouts and execution options.
Configuration is synthetic metadata: no client event, external request, tool execution, or usage increment is produced.

Creation uses scenario-owned IDs, creation time and creator identity.
Replacement preserves the ID, creator, creation time, access, usage statistics, execution history and agent references.
Reads and discovery use the same canonical tools map; failed writes leave it unchanged and do not consume IDs.
Reset restores baseline tools and the creation counter.

Supported parameter schemas contain object properties and literal string, boolean, integer or number properties, optional descriptions, string enums and required keys.
Schemas are bounded to four nested levels and fifty properties per object.
Webhook configuration supports literal headers, path/query/body/response schemas, HTTP method and content type; it only stores these values.

Nonempty response mocks or assignments, dynamic variables, redirect following, authentication connections, secret/environment header locators, arrays and advanced parameter-schema features, and MCP/system tool types return `unsupported_tool_config` (400).
Malformed names, timeouts or URLs return `invalid_tool_config` (400); updating a missing tool returns `tool_not_found` (404).
The runtime also validates requests against the generated versioned contract before handler entry.
