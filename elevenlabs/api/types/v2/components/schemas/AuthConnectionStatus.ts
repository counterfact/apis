/**
 * Single status field shared by every auth type's stored credential.
 *
 * OAuth values (``REFRESH_FAILED``, ``REVOKED``) are written by the OAuth
 * token-manager refresh path. ``CREDENTIAL_INVALID`` is written by the
 * tool execution path when an upstream response matches a credential's
 * ``failure_signatures`` entry (Bearer, Basic auth, etc.).
 * @default "active"
 */
export type AuthConnectionStatus =
  "active" | "refresh_failed" | "revoked" | "credential_invalid";
