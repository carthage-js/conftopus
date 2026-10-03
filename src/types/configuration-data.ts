import { AbstractUrlHandler } from "$project/handlers";

export type ConfigurationData = (
  | {
      $dynamic: false;
    }
  | {
      $dynamic: true;
      dirty: boolean;
      url: URL;
      handler: AbstractUrlHandler;
    }
) & {
  json: Promise<any>;
  conftopusData?:
    | {
        type: "array";
        entries: ConfigurationData[];
      }
    | {
        type: "object";
        entries: { [key: string]: ConfigurationData };
      }
    | {
        type: "nested";
        entry: ConfigurationData;
      };
};
