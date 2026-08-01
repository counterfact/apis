// https://developer.ordergroove.com/reference/authentication
// This simulator implements the OpenAPI contract's Application API x-api-key
// scheme. The separately documented Storefront HMAC scope is not in that contract.
export const middleware = async ($: any, respondTo: any) => {
  if (!$.context.isAuthorized($.auth.apiKey)) {
    return $.response[401].json({ error: "Unauthorized" });
  }

  return respondTo($);
};
