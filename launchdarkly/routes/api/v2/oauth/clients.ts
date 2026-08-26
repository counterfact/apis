import type { getOAuthClients } from "../../../../types/paths/api/v2/oauth/clients.types.js";
import type { createOAuth2Client } from "../../../../types/paths/api/v2/oauth/clients.types.js";

export const GET: getOAuthClients = async ($) => {
  return $.response[200].random();
};

export const POST: createOAuth2Client = async ($) => {
  return $.response[201].random();
};
