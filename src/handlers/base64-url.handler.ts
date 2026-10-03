import { AbstractUrlHandler } from "$project/handlers/abstract-url.handler";
import graou from "@carthage-js/graou";
import { Base64UrlHandlerErrors } from "$project/errors";

@graou.decorators.AutoErrors(Base64UrlHandlerErrors)
export class Base64UrlHandler extends AbstractUrlHandler {
  private _data!: string;

  constructor(url: URL) {
    super();
    Base64UrlHandlerErrors.codes.constructor.subcodes.InvalidBase64Value.trap(() => {
      this._data = atob(url.host);
    });
  }

  async getData(): Promise<any> {
    return this._data;
  }
}
