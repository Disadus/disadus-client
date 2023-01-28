import { EventEmitter } from "events";
import { settingsMap } from "../creds/credHandler";
import { DisadusCredType } from "../types/CredType";
export class BaseClient extends EventEmitter {
  static instance: BaseClient;
  static getInstance(): BaseClient {
    if (!BaseClient.instance) {
      BaseClient.instance = new BaseClient();
    }
    return BaseClient.instance;
  }
  constructor() {
    super();
  }
  setAuth(token: string, type: DisadusCredType) {
    settingsMap.set(type, token);
    return this;
  }
  getAuth(type: DisadusCredType) {
    return settingsMap.get(type);
  }
}
