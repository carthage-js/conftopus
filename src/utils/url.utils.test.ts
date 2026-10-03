import { describe, expect, test } from "@jest/globals";
import { sanitizeUrl } from "$project/utils/url.utils";

describe("sanitizeUrl", () => {
  for (const [stableUrl, unstableUrl] of [
    ["https://url.mock/", "https://url.mock/"],
    ["https://url.mock/", "https://url.mock"],
    ["https://url.mock/", "https://url.mock//////"],
    ["https://url.mock/a/simple/demo", "https://url.mock///a//simple///demo/"],
    ["https://url.mock/a/simple/demo", "https://url.mock///a//simple////demo"],
    ["https://url.mock/?a=0&b=1&c=2", "https://url.mock/?a=0&b=1&c=2"],
    ["https://url.mock/?a=0&b=1&c=2", "https://url.mock/?c=2&a=0&b=1"],
    ["https://url.mock/?a=0&b=1&b=2&c=2", "https://url.mock/?b=1&a=0&b=2&c=2"],
  ]) {
    test(`Must be equivalent: ${stableUrl} <=> ${unstableUrl}`, () => {
      const url = new URL(unstableUrl);
      sanitizeUrl(url);
      expect(url.toString()).toEqual(stableUrl);
    });
  }
});
