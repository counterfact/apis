import type { CustomerCreate } from "./CustomerCreate.js";

export type Customer = CustomerCreate & { id?: string | number };
