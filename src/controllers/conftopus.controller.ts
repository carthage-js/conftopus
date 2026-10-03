import { AbstractUrlHandlerFactory } from "$project/factories";
import { ConfigurationDelegateBinding } from "$project/types";
import graou from "@carthage-js/graou";
import { ConftopusControllerErrors } from "$project/errors";
import { ConfigurationDelegateHandler } from "$project/handlers";
import { parseGetDescriptorPath } from "$project/utils/get-descriptor.utils";

@graou.decorators.AutoErrors(ConftopusControllerErrors)
export class ConftopusController {
  private readonly _factories: Record<string, AbstractUrlHandlerFactory>;
  private readonly _entrypoint: any;
  private _running: boolean;
  private _configurationDelegateBindings: ConfigurationDelegateBinding;

  constructor(inputs: { factories: Record<string, AbstractUrlHandlerFactory>; entrypoint: any }) {
    this._factories = inputs.factories;
    this._entrypoint = inputs.entrypoint;
    this._running = false;
    this._configurationDelegateBindings = {};
  }

  createConfigurationDelegate(path: string): ConfigurationDelegateHandler {
    if (this._running) {
      throw ConftopusControllerErrors.codes.createConfigurationDelegate.subcodes.DisallowCreateDelegateWhileControllerIsRunning.factory(
        "You aren't allowed to create configuration delegate while the controller is running.",
      );
    }

    const getDescriptorPath = parseGetDescriptorPath(path);
    let index = 0;
    let binding = this._configurationDelegateBindings;
    for (const item of getDescriptorPath) {
      if (item.type === "array") {
        if (!binding.nested) {
          binding.nested = {
            type: "array",
            minLength: 0,
            bindings: {},
          };
        } else if (binding.nested.type !== "array") {
          throw ConftopusControllerErrors.codes.createConfigurationDelegate.subcodes.TwoOrMoreDelegatePathCrossAndTypeMismatch.factory(
            `You can't create a delegate with '${path}' because the operation at ${index} mismatch with other delegate. The controller was expecting ${binding.nested.type} type.`,
          );
        }

        if (!binding.nested.bindings[item.index]) {
          if (binding.nested.minLength <= item.index) {
            binding.nested.minLength = item.index + 1;
          }

          binding.nested.bindings[item.index] = {};
        }

        binding = binding.nested.bindings[item.index];
      } else {
        if (!binding.nested) {
          binding.nested = {
            type: "object",
            bindings: {},
          };
        } else if (binding.nested.type !== "object") {
          throw ConftopusControllerErrors.codes.createConfigurationDelegate.subcodes.TwoOrMoreDelegatePathCrossAndTypeMismatch.factory(
            `You can't create a delegate with '${path}' because the operation at ${index} mismatch with other delegate. The controller was expecting ${binding.nested.type} type.`,
          );
        }

        if (!binding.nested.bindings[item.key]) {
          binding.nested.bindings[item.key] = {};
        }

        binding = binding.nested.bindings[item.key];
      }

      index++;
    }

    if (!binding.delegate) {
      binding.delegate = new ConfigurationDelegateHandler();
    }

    return binding.delegate;
  }
}
