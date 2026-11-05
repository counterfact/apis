import type { Routes } from "../../types/index.js";
type Route = Routes["/convai"]["/whatsapp-accounts"];
import type {Context} from "./whatsapp-accounts/_.context.js";
export const GET: Route["GET"] = async ($) => $.response.status(200).json(($.context).list());
