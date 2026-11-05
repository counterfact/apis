import type { AgentTransferOpReplace } from "./AgentTransferOpReplace.js";
import type { AgentTransferOpPush } from "./AgentTransferOpPush.js";
import type { AgentTransferOpPop } from "./AgentTransferOpPop.js";
export type AgentTransferOp =
  | (AgentTransferOpReplace & { type: "replace" })
  | (AgentTransferOpPush & { type: "push" })
  | (AgentTransferOpPop & { type: "pop" });
