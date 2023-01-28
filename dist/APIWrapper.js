"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.APIWrapper = exports.PluginIntent = void 0;
const customFetch_1 = require("./customFetch");
var PluginIntent;
(function (PluginIntent) {
    // Chat
    PluginIntent["getSelf"] = "getSelf";
    PluginIntent["getUser"] = "getUser";
    PluginIntent["getUsers"] = "getUsers";
    PluginIntent["getAssignment"] = "getAssignment";
    PluginIntent["getCourse"] = "getCourse";
    PluginIntent["getCommunity"] = "getCommunity";
    PluginIntent["getLMSLinkedSelf"] = "getLMSLinkedSelf";
})(PluginIntent = exports.PluginIntent || (exports.PluginIntent = {}));
class APIWrapper {
    constructor(node) {
        this._ready = false;
        this._parent = null;
        this._token = null;
        this.requests = new Map();
        if (!node)
            this.init();
    }
    get readyState() {
        return this._ready;
    }
    static getInstance() {
        if (!APIWrapper._self) {
            APIWrapper._self = new APIWrapper();
        }
        return APIWrapper._self;
    }
    init() {
        if (window.top) {
            console.log("[APIWrapper]", "Constructing APIWrapper");
            window.top.postMessage(JSON.stringify({
                event: "connect",
            }), "*", []);
        }
        else {
            console.error("No window.top");
        }
        this.boundReady = this.ready.bind(this);
        window.addEventListener("message", this.boundReady);
        localforage.getItem("__$DisadusAppToken").then((store) => {
            const token = store;
            if (token && token.expires > Date.now()) {
                this._token = token;
            }
        });
    }
    processMessage(event) {
        const message = JSON.parse(event.data);
        if (message.response) {
            const callback = this.requests.get(message.requestID);
            if (callback) {
                callback(message);
            }
            this.requests.delete(message.requestID);
        }
        if (message.response.event === "token" && message.response.data) {
            this._token = message.response.data;
            console.log("[APIWrapper]", "Refreshed token", this._token);
        }
    }
    ready(event) {
        if (this._ready) {
            console.error("[APIWrapper]", "Already ready");
            return;
        }
        if (typeof event.data !== "string") {
            return;
        }
        try {
            JSON.parse(event.data);
        }
        catch (error) {
            return;
        }
        console.log("[APIWrapper]", "Readying", JSON.parse(event.data));
        const tokenInfo = JSON.parse(event.data);
        this._token = tokenInfo.response.data;
        if (!this._token)
            return;
        this._ready = true;
        console.log("[APIWrapper]", "Token", this._token, this);
        localforage.setItem("__$DisadusAppToken", this._token);
        window.addEventListener("message", this.processMessage.bind(this));
        window.removeEventListener("message", this.boundReady);
    }
    getRequestId() {
        let requestId = Math.random().toString(36).substring(2);
        while (this.requests.has(requestId)) {
            requestId = Math.random().toString(36).substring(2);
        }
        return requestId;
    }
    sendRequest(name, data) {
        return new Promise(async (resolve, reject) => {
            var _a;
            const requestId = this.getRequestId();
            const message = {
                requestID: requestId,
                event: name,
                request: data,
            };
            while (!this._ready) {
                await new Promise((resolve) => setTimeout(resolve, 20));
            }
            (_a = window.top) === null || _a === void 0 ? void 0 : _a.postMessage(JSON.stringify(message), "*", []);
            this.requests.set(requestId, (response) => {
                resolve(response.response);
            });
        });
    }
    async requestIntents(intents) {
        const result = (await this.sendRequest("requestIntents", {
            intents,
        }));
        if (result.success) {
            this._token = result.data;
        }
        else {
            console.error("[APIWrapper]", "RequestIntents failed", result);
        }
        return result.success;
    }
    async waitForToken() {
        console.log("[APIWrapper]", "Waiting for token", this);
        while (!this._token) {
            await new Promise((resolve) => setTimeout(resolve, 20));
        }
        console.log("[APIWrapper]", "Got token", this._token);
        return this._token;
    }
    async getUser(userid) {
        return (0, customFetch_1.nFetch)(`https://api.disadus.app/user/${userid}`, {})
            .then((res) => res.json())
            .catch(() => null);
    }
    async getSelf() {
        const token = await this.waitForToken();
        return (0, customFetch_1.nFetch)(`https://api.disadus.app/user/@me`, {
            headers: {
                Authorization: `Plugin ${token.token}`,
            },
        })
            .then((res) => res.json())
            .catch(() => null);
    }
    async getCommunity(communityid) {
        return (0, customFetch_1.nFetch)(`https://api.disadus.app/community/${communityid}`, {})
            .then((res) => res.json())
            .catch(() => null);
    }
    async getLMSSelf(communityID) {
        const token = await this.waitForToken();
        return (0, customFetch_1.nFetch)(`https://api.disadus.app/community/${communityID}/LMS/@me`, {
            headers: {
                Authorization: `Plugin ${token.token}`,
            },
        })
            .then((res) => res.json())
            .catch(() => null);
    }
    async sendToast(toast) {
        const toastResponse = this.sendRequest("sendToast", toast);
        return toastResponse.then((response) => response.success);
    }
}
exports.APIWrapper = APIWrapper;
