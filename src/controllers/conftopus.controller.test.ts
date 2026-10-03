import { describe, expect, test } from "@jest/globals";
import { ConftopusController } from "$project/controllers/conftopus.controller";
import { ConftopusControllerErrors } from "$project/errors";

describe("ConftopusController", () => {
  describe("createConfigurationDelegate", () => {
    for (const paths of [
      ["a", "a.b", "a.c"],
      ["[0][1]", "[1][2]", "[0][3]"],
      ["[0].a", "[1][0]", "[0].b", "[2].c"],
    ]) {
      test(`${paths.join(" + ")} are valid combination of delegates`, () => {
        const ctrl = new ConftopusController({
          factories: {},
          entrypoint: "",
        });
        expect(() => {
          for (const path of paths) {
            ctrl.createConfigurationDelegate(path);
          }
        }).not.toThrow();
      });
    }

    for (const paths of [
      ["[0]", "a"],
      ["[0].a", "[0][1]"],
    ]) {
      test(`${paths.join(" + ")} are invalid combination of delegates`, () => {
        const ctrl = new ConftopusController({
          factories: {},
          entrypoint: "",
        });
        expect(() => {
          for (const path of paths) {
            ctrl.createConfigurationDelegate(path);
          }
        }).toThrow(
          ConftopusControllerErrors.codes.createConfigurationDelegate.subcodes
            .TwoOrMoreDelegatePathCrossAndTypeMismatch.$class,
        );
      });
    }
  });
});
