import { BaseClient } from "./BaseClient";
import { io, Socket } from "socket.io-client";
import { DisadusCredType } from "../types/CredType";
import { PublicUser, User } from "../types/DisadusTypes";
import nFetch from "../customFetch";

export class AuthUserClient extends BaseClient {
  // @ts-ignore
  apiURL = globalThis._disadusAuthAPIURL ?? "https://usersAPI.disadus.app";
  socket = null as null | Socket;
  internalSocket = null as null | Socket;
  constructor() {
    super();
    if (this.getAuth(DisadusCredType.CLIENT)) {
      this.socket = io(this.apiURL, {
        extraHeaders: {
          Authorization: this.getAuth(DisadusCredType.CLIENT)!,
        },
      });
    }
    if (this.getAuth(DisadusCredType.INTERNAL)) {
      this.internalSocket = io(this.apiURL, {
        extraHeaders: {
          Authorization: this.getAuth(DisadusCredType.INTERNAL)!,
        },
      });
    }
  }
  /**
   * Gets the auth token for a user
   */
  async getAuthToken(email: string, password: string): Promise<string | null> {
    const tokenReq = await nFetch(`${this.apiURL}/login`, {
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
  async issueToken(userid: string) {
    if (this.internalSocket) {
      this.internalSocket?.emit("issueToken", userid);
      return new Promise((resolve) => {
        const listener = (token: string, userID: string) => {
          if (userid === userID) {
            resolve(token);
            this.internalSocket?.off("issueToken", listener);
          }
        };
        this.internalSocket?.on("issueToken", listener);
      }) as Promise<string>;
    }
    throw new Error("Not an internal client");
  }

  /**
   * Gets a user from the API, if filtered is true, it will only return the public user object, if false, it will return the full user object (only internal clients can do this)
   * @param userid
   * @param filtered
   */
  async getUser(
    userid: string,
    filtered = true
  ): Promise<PublicUser | User | null> {
    if (filtered) {
      if (this.socket) {
        this.socket?.emit("getUser", userid, filtered);
        return new Promise((resolve) => {
          this.socket?.once("getUser", (user: PublicUser | null) => {
            resolve(user);
          });
        });
      }
      const userReq = await nFetch(`${this.apiURL}/user/${userid}`, {
        headers: {
          Authorization: this.getAuth(DisadusCredType.CLIENT)!,
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
    this.internalSocket?.emit("getUser", userid, filtered);
    return new Promise((resolve) => {
      this.internalSocket?.once("getUser", (user: User | null) => {
        resolve(user);
      });
    });
  }
  /**
   * Gets self from the API (only user clients can do this)
   */
  async getSelf(): Promise<User | null> {
    if (this.getAuth(DisadusCredType.CLIENT)) {
      if (this.socket) {
        this.socket?.emit("getSelf");
        return new Promise((resolve) => {
          this.socket?.once("getSelf", (user: User | null) => {
            resolve(user);
          });
        });
      }
      const selfReq = await nFetch(`${this.apiURL}/user/@me`, {
        headers: {
          Authorization: this.getAuth(DisadusCredType.CLIENT)!,
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
  async updateSelf(user: Partial<User>): Promise<User | null> {
    if (this.getAuth(DisadusCredType.CLIENT)) {
      const selfReq = await nFetch(`${this.apiURL}/user/@me`, {
        method: "PATCH",
        headers: {
          Authorization: this.getAuth(DisadusCredType.CLIENT)!,
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
  async updateUser(user: Partial<User>): Promise<User | null> {
    if (!user.id) throw new Error("User ID is required");
    if (this.internalSocket) {
      this.internalSocket?.emit("updateUser", user);
      return new Promise((resolve) => {
        const listener = (user: User | null, userID: string) => {
          if (user?.id === userID) {
            resolve(user);
            this.internalSocket?.off("updateUser", listener);
          }
        };
        this.internalSocket?.on("updateUser", listener);
      }) as Promise<User | null>;
    }
    throw new Error("Not authorized");
  }
  //   /**
  //    * Updates
  //    */
}
