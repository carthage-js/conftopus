import { ErrorsFactory } from "$project/errors/errors.factory";

export const ConftopusControllerErrors = ErrorsFactory(
  "ConftopusController",
  ["constructor", "createConfigurationDelegate"],
  {
    constructor: [],
    createConfigurationDelegate: [
      "DisallowCreateDelegateWhileControllerIsRunning",
      "TwoOrMoreDelegatePathCrossAndTypeMismatch",
    ],
  },
);
