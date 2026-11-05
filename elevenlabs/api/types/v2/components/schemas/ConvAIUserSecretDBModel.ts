/**
 * User-specific secret model that are not shared with other users in a workspace.
 */
export type ConvAIUserSecretDBModel = {
  name: string;
  encrypted_value: string;
  nonce: string;
  id: string;
};
