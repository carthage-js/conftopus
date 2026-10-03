import { ConfigurationDelegateHandler } from "$project/handlers";

export interface ConfigurationDelegateBinding {
  delegate?: ConfigurationDelegateHandler;
  nested?:
    | {
        type: "array";
        minLength: number;
        bindings: Record<number, ConfigurationDelegateBinding>;
      }
    | {
        type: "object";
        bindings: Record<string, ConfigurationDelegateBinding>;
      };
}
