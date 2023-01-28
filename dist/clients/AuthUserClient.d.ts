import { BaseClient } from "./BaseClient";
import { Socket } from "socket.io-client";
import { PublicUser, User } from "../types/DisadusTypes";
export declare class AuthUserClient extends BaseClient {
    apiURL: any;
    socket: Socket<import("@socket.io/component-emitter").DefaultEventsMap, import("@socket.io/component-emitter").DefaultEventsMap> | null;
    internalSocket: Socket<import("@socket.io/component-emitter").DefaultEventsMap, import("@socket.io/component-emitter").DefaultEventsMap> | null;
    constructor();
    /**
     * Gets the auth token for a user
     */
    getAuthToken(email: string, password: string): Promise<string | null>;
    /**
     * Issues a new token for a user (only internal clients can do this)
     */
    issueToken(userid: string): Promise<string>;
    /**
     * Gets a user from the API, if filtered is true, it will only return the public user object, if false, it will return the full user object (only internal clients can do this)
     * @param userid
     * @param filtered
     */
    getUser(userid: string, filtered?: boolean): Promise<PublicUser | User | null>;
    /**
     * Gets self from the API (only user clients can do this)
     */
    getSelf(): Promise<User | null>;
    /**
     * Updates self from the API, excludes certain fields (only user clients can do this)
     */
    updateSelf(user: Partial<User>): Promise<User | null>;
    /**
     * Updates a user from the API, excludes certain fields (only internal clients can do this)
     */
    updateUser(user: Partial<User>): Promise<User | null>;
}
//# sourceMappingURL=AuthUserClient.d.ts.map