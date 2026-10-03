import { ErrorsFactory } from "$project/errors/errors.factory";

export const Base64UrlHandlerErrors = ErrorsFactory(
  "Base64UrlHandler",
  ["constructor", "getData"],
  {
    constructor: ["InvalidBase64Value"],
  },
);
