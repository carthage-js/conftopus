import { ErrorsFactory } from "$project/errors/errors.factory";

export const UtilsErrors = ErrorsFactory("utils", ["parseGetDescriptorPath"], {
  parseGetDescriptorPath: ["InvalidSyntax", "UnexpectedCharacter"],
});
