import { describe, expect, test } from "@jest/globals";
import { GetDescriptorPath } from "$project/types/get-descriptor";
import { parseGetDescriptorPath } from "$project/utils/get-descriptor.utils";
import { UtilsErrors } from "$project/errors";

describe("parseGetDescriptorPath", () => {
  describe("Should process nicely", () => {
    for (const [path, result] of [
      [
        "test",
        [
          {
            type: "object",
            key: "test",
          },
        ],
      ],
      [
        "   test   ",
        [
          {
            type: "object",
            key: "test",
          },
        ],
      ],
      [
        "   test   .     nice    ",
        [
          {
            type: "object",
            key: "test",
          },
          {
            type: "object",
            key: "nice",
          },
        ],
      ],
      [
        "test[100].a[0][255]",
        [
          {
            type: "object",
            key: "test",
          },
          {
            type: "array",
            index: 100,
          },
          {
            type: "object",
            key: "a",
          },
          {
            type: "array",
            index: 0,
          },
          {
            type: "array",
            index: 255,
          },
        ],
      ],
      [
        "[ 1 000 ][2 000 000]",
        [
          {
            type: "array",
            index: 1000,
          },
          {
            type: "array",
            index: 2_000_000,
          },
        ],
      ],
      [
        "[ 1 000 ].[2 000 000]",
        [
          {
            type: "array",
            index: 1000,
          },
          {
            type: "array",
            index: 2_000_000,
          },
        ],
      ],
    ] as [string, GetDescriptorPath][]) {
      test(path, () => {
        expect(parseGetDescriptorPath(path)).toEqual(result);
      });
    }
  });

  describe("should fail because path contains an unexpected character", () => {
    for (const path of ["[a]", ".", "{}", "a {}"]) {
      test(path, () => {
        expect(
          UtilsErrors.codes.parseGetDescriptorPath.subcodes.UnexpectedCharacter.lookup(() => {
            parseGetDescriptorPath(path);
          }),
        ).toBeInstanceOf(
          UtilsErrors.codes.parseGetDescriptorPath.subcodes.UnexpectedCharacter.$class,
        );
      });
    }
  });

  describe("should fail because path is unfinished or malformed", () => {
    for (const path of ["", "[]", "[   ]", "[", "a."]) {
      test(path, () => {
        expect(
          UtilsErrors.codes.parseGetDescriptorPath.subcodes.InvalidSyntax.lookup(() => {
            parseGetDescriptorPath(path);
          }),
        ).toBeInstanceOf(UtilsErrors.codes.parseGetDescriptorPath.subcodes.InvalidSyntax.$class);
      });
    }
  });
});
