"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseClient = void 0;
const events_1 = require("events");
const credHandler_1 = require("../creds/credHandler");
class BaseClient extends events_1.EventEmitter {
    constructor() {
        super();
    }
    static getInstance() {
        if (!BaseClient.instance) {
            BaseClient.instance = new BaseClient();
        }
        return BaseClient.instance;
    }
    setAuth(token, type) {
        credHandler_1.settingsMap.set(type, token);
        return this;
    }
    getAuth(type) {
        return credHandler_1.settingsMap.get(type);
    }
}
exports.BaseClient = BaseClient;
