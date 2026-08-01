// https://developer.ordergroove.com/reference/authentication
// The authoritative OpenAPI contract models only Application x-api-key auth.
export const middleware = async ($: any, respondTo: any) => {
  if (!$.context.isAuthorized($.auth.apiKey)) {
    return $.response[401].json({ error: "Unauthorized" });
  }

  return respondTo($);
};
