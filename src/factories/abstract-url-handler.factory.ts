import { AbstractUrlHandler } from "$project/handlers";

export abstract class AbstractUrlHandlerFactory {
  abstract build(url: URL): AbstractUrlHandler;
}
