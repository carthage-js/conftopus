import { describe, expect, test } from "@jest/globals";
import { Base64UrlHandler } from "$project/handlers/base64-url.handler";
import { Base64UrlHandlerErrors } from "$project/errors/handlers.errors";

describe("Base64UrlHandler", () => {
  test("should parse a base64 string", async () => {
    await expect(new Base64UrlHandler(new URL("base64://dGVzdA==")).getData()).resolves.toEqual(
      "test",
    );
  });

  test("should fail to make a new instance if the base64 value is malformed", async () => {
    expect(
      Base64UrlHandlerErrors.codes.constructor.subcodes.InvalidBase64Value.lookup(
        () => new Base64UrlHandler(new URL("base64://bad_base64_value")),
      ),
    ).toBeInstanceOf(Base64UrlHandlerErrors.codes.constructor.subcodes.InvalidBase64Value.$class);
  });
});
