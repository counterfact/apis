import type { UnixMillis } from "./UnixMillis.js";

export type ReviewOutput = {
  _id: string;
  kind: string;
  creationDate?: UnixMillis;
  comment?: string;
  memberId?: string;
  serviceTokenId?: string;
};
