import { AbstractUrlHandler } from "$project/handlers";
import { AbstractUrlHandlerFactory } from "$project/factories/abstract-url-handler.factory";

export class GenericUrlHandlerFactory<
  UrlHandlerClassType extends { new (url: URL): AbstractUrlHandler },
> extends AbstractUrlHandlerFactory {
  private readonly $class: UrlHandlerClassType;

  constructor($class: UrlHandlerClassType) {
    super();
    this.$class = $class;
  }

  build(url: URL): AbstractUrlHandler {
    return new this.$class(url);
  }
}
