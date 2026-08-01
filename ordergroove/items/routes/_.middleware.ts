export const middleware = async ($: any, respondTo: any) => {
  if (!$.context.isAuthorized($.auth.apiKey)) {
    return $.response[401].json({ error: "Unauthorized" });
  }

  return respondTo($);
};
