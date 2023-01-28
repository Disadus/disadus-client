import { Community, DisadusToast, PublicUser, User } from "./types/DisadusTypes";
export declare type RequestResponse<T> = {
    event: string;
    success: boolean;
    data: T;
};
export declare type RawResponse<T> = {
    requestID: string;
    response: RequestResponse<T>;
};
export declare type RawRequest<T> = {
    requestID: string;
    event: string;
    request: T;
};
export declare type TokenInfo = {
    token: string;
    expires: number;
} | null;
export declare enum PluginIntent {
    getSelf = "getSelf",
    getUser = "getUser",
    getUsers = "getUsers",
    getAssignment = "getAssignment",
    getCourse = "getCourse",
    getCommunity = "getCommunity",
    getLMSLinkedSelf = "getLMSLinkedSelf"
}
export declare class APIWrapper {
    _ready: boolean;
    _parent: MessageEventSource | null;
    _token: TokenInfo;
    requests: Map<string, (data: RawResponse<any>) => void>;
    boundReady?: (data: MessageEvent<any>) => void;
    get readyState(): boolean;
    static _self: APIWrapper;
    static getInstance(): APIWrapper;
    constructor(node?: boolean);
    init(): void;
    processMessage(event: MessageEvent): void;
    ready(event: MessageEvent): void;
    getRequestId(): string;
    sendRequest(name: string, data: any): Promise<RequestResponse<any>>;
    requestIntents(intents: PluginIntent[]): Promise<boolean>;
    waitForToken(): Promise<{
        token: string;
        expires: number;
    }>;
    getUser(userid: string): Promise<PublicUser | null>;
    getSelf(): Promise<User | null>;
    getCommunity(communityid: string): Promise<Community | null>;
    getLMSSelf(communityID: string): Promise<import("./types/LMSTypes").SchoologySelf | null>;
    sendToast(toast: DisadusToast): Promise<boolean>;
}
//# sourceMappingURL=APIWrapper.d.ts.map