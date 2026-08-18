import type { Context$ } from "../../types/_.context.js";
import type { api_overview } from "../../types/components/schemas/api-overview.js";

export class Context {
  private overview: api_overview = {
    verifiable_password_authentication: true,
  };

  constructor(private readonly $: Context$) {}

  setApiOverview(value: api_overview): api_overview {
    this.overview = structuredClone(value);
    return this.getApiOverview();
  }

  getApiOverview(): api_overview {
    return structuredClone(this.overview);
  }
}
