"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthUserClient = void 0;
const BaseClient_1 = require("./BaseClient");
const socket_io_client_1 = require("socket.io-client");
const CredType_1 = require("../types/CredType");
const customFetch_1 = __importDefault(require("../customFetch"));
class AuthUserClient extends BaseClient_1.BaseClient {
    constructor() {
        var _a;
        super();
        // @ts-ignore
        this.apiURL = (_a = globalThis._disadusAuthAPIURL) !== null && _a !== void 0 ? _a : "https://usersAPI.disadus.app";
        this.socket = null;
        this.internalSocket = null;
        if (this.getAuth(CredType_1.DisadusCredType.CLIENT)) {
            this.socket = (0, socket_io_client_1.io)(this.apiURL, {
                extraHeaders: {
                    Authorization: this.getAuth(CredType_1.DisadusCredType.CLIENT),
                },
            });
        }
        if (this.getAuth(CredType_1.DisadusCredType.INTERNAL)) {
            this.internalSocket = (0, socket_io_client_1.io)(this.apiURL, {
                extraHeaders: {
                    Authorization: this.getAuth(CredType_1.DisadusCredType.INTERNAL),
                },
            });
        }
    }
    /**
     * Gets the auth token for a user
     */
    async getAuthToken(email, password) {
        const tokenReq = await (0, customFetch_1.default)(`${this.apiURL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                password,
            }),
        });
        if (tokenReq.status === 200) {
            return `Bearer ${tokenReq.text()}`;
        }
        if (tokenReq.status === 401) {
            throw new Error("Invalid credentials");
        }
        return null;
    }
    /**
     * Issues a new token for a user (only internal clients can do this)
     */
    async issueToken(userid) {
        var _a;
        if (this.internalSocket) {
            (_a = this.internalSocket) === null || _a === void 0 ? void 0 : _a.emit("issueToken", userid);
            return new Promise((resolve) => {
                var _a;
                const listener = (token, userID) => {
                    var _a;
                    if (userid === userID) {
                        resolve(token);
                        (_a = this.internalSocket) === null || _a === void 0 ? void 0 : _a.off("issueToken", listener);
                    }
                };
                (_a = this.internalSocket) === null || _a === void 0 ? void 0 : _a.on("issueToken", listener);
            });
        }
        throw new Error("Not an internal client");
    }
    /**
     * Gets a user from the API, if filtered is true, it will only return the public user object, if false, it will return the full user object (only internal clients can do this)
     * @param userid
     * @param filtered
     */
    async getUser(userid, filtered = true) {
        var _a, _b;
        if (filtered) {
            if (this.socket) {
                (_a = this.socket) === null || _a === void 0 ? void 0 : _a.emit("getUser", userid, filtered);
                return new Promise((resolve) => {
                    var _a;
                    (_a = this.socket) === null || _a === void 0 ? void 0 : _a.once("getUser", (user) => {
                        resolve(user);
                    });
                });
            }
            const userReq = await (0, customFetch_1.default)(`${this.apiURL}/user/${userid}`, {
                headers: {
                    Authorization: this.getAuth(CredType_1.DisadusCredType.CLIENT),
                },
            });
            if (userReq.status === 200) {
                return userReq.json();
            }
            return null;
        }
        if (!this.internalSocket) {
            throw new Error("Only internal clients can get non-filtered users");
        }
        (_b = this.internalSocket) === null || _b === void 0 ? void 0 : _b.emit("getUser", userid, filtered);
        return new Promise((resolve) => {
            var _a;
            (_a = this.internalSocket) === null || _a === void 0 ? void 0 : _a.once("getUser", (user) => {
                resolve(user);
            });
        });
    }
    /**
     * Gets self from the API (only user clients can do this)
     */
    async getSelf() {
        var _a;
        if (this.getAuth(CredType_1.DisadusCredType.CLIENT)) {
            if (this.socket) {
                (_a = this.socket) === null || _a === void 0 ? void 0 : _a.emit("getSelf");
                return new Promise((resolve) => {
                    var _a;
                    (_a = this.socket) === null || _a === void 0 ? void 0 : _a.once("getSelf", (user) => {
                        resolve(user);
                    });
                });
            }
            const selfReq = await (0, customFetch_1.default)(`${this.apiURL}/user/@me`, {
                headers: {
                    Authorization: this.getAuth(CredType_1.DisadusCredType.CLIENT),
                },
            });
            if (selfReq.status === 200) {
                return selfReq.json();
            }
            return null;
        }
        throw new Error("Not authorized");
    }
    /**
     * Updates self from the API, excludes certain fields (only user clients can do this)
     */
    async updateSelf(user) {
        if (this.getAuth(CredType_1.DisadusCredType.CLIENT)) {
            const selfReq = await (0, customFetch_1.default)(`${this.apiURL}/user/@me`, {
                method: "PATCH",
                headers: {
                    Authorization: this.getAuth(CredType_1.DisadusCredType.CLIENT),
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(user),
            });
            if (selfReq.status === 200) {
                return selfReq.json();
            }
            const error = await selfReq.text();
            throw new Error(error);
        }
        throw new Error("Not authorized");
    }
    /**
     * Updates a user from the API, excludes certain fields (only internal clients can do this)
     */
    async updateUser(user) {
        var _a;
        if (!user.id)
            throw new Error("User ID is required");
        if (this.internalSocket) {
            (_a = this.internalSocket) === null || _a === void 0 ? void 0 : _a.emit("updateUser", user);
            return new Promise((resolve) => {
                var _a;
                const listener = (user, userID) => {
                    var _a;
                    if ((user === null || user === void 0 ? void 0 : user.id) === userID) {
                        resolve(user);
                        (_a = this.internalSocket) === null || _a === void 0 ? void 0 : _a.off("updateUser", listener);
                    }
                };
                (_a = this.internalSocket) === null || _a === void 0 ? void 0 : _a.on("updateUser", listener);
            });
        }
        throw new Error("Not authorized");
    }
}
exports.AuthUserClient = AuthUserClient;
