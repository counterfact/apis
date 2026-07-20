type RouteResult = {
  status: number;
  body?: unknown;
  headers: Record<string, string>;
};

export const createResponse = () => {
  const makeBuilder = (
    status: number,
    headers: Record<string, string> = {},
  ): never => {
    const builder = {
      status,
      headers,
      header: (name: string, value: string) =>
        makeBuilder(status, { ...headers, [name]: value }),
      html: (body: unknown): RouteResult => ({ status, headers, body }),
      text: (body: unknown): RouteResult => ({ status, headers, body }),
      json: (body: unknown): RouteResult => ({ status, headers, body }),
      empty: (): RouteResult => ({ status, headers }),
      random: (): RouteResult => ({ status, headers }),
    };
    return builder as never;
  };

  return new Proxy(
    {},
    {
      get: (_, key) => makeBuilder(Number(key)),
    },
  ) as never;
};
