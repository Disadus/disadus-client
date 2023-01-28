/// <reference types="node" />
import { EventEmitter } from "events";
import { DisadusCredType } from "../types/CredType";
export declare class BaseClient extends EventEmitter {
    static instance: BaseClient;
    static getInstance(): BaseClient;
    constructor();
    setAuth(token: string, type: DisadusCredType): this;
    getAuth(type: DisadusCredType): string | undefined;
}
//# sourceMappingURL=BaseClient.d.ts.map