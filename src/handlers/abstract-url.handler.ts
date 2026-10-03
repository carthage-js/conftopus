import EventEmitter from "eventemitter3";

export abstract class AbstractUrlHandler extends EventEmitter {
  abstract getData(): Promise<any>;
}
