import Cookies from "js-cookie";
import React from "react";

export interface AuthInfo {
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
  refreshExpiresIn: number;
}
export interface IRequestContext {
  isServer: boolean;
  accessToken: string | undefined;
  expiresIn: number | undefined;
  refreshToken: string | undefined;
  refreshExpiresIn: number | undefined;

  onLoginSuccess(authInfo: AuthInfo): void;

  onLogout(): void;
}

export const RequestContext = React.createContext<IRequestContext>({
  isServer: false,
  accessToken: undefined,
  expiresIn: undefined,
  refreshToken: undefined,
  refreshExpiresIn: undefined,
  onLoginSuccess: (authInfo: AuthInfo) => {},
  onLogout: () => {},
});

export function useRequestContext(): IRequestContext {
  return React.useContext(RequestContext);
}

export class ServerRequestContext implements IRequestContext {
  isServer = true;
  _accessToken: string | undefined;

  constructor(private readonly cookies: Record<string, string>) {}

  get accessToken(): string | undefined {
    return this.cookies["accessToken"] ?? this._accessToken;
  }
  set accessToken(value: string | undefined) {
    throw new Error("Method not implemented.");
  }
  get expiresIn(): number | undefined {
    const value = this.cookies["expiresIn"];
    return value ? Number(value) : undefined;
  }
  set expiresIn(value: number | undefined) {
    throw new Error("Method not implemented.");
  }
  get refreshToken(): string | undefined {
    return this.cookies["refreshToken"];
  }
  set refreshToken(value: string | undefined) {
    throw new Error("Method not implemented.");
  }
  get refreshExpiresIn(): number | undefined {
    const value = this.cookies["refreshExpiresIn"];
    return value ? Number(value) : undefined;
  }
  set refreshExpiresIn(value: number | undefined) {
    throw new Error("Method not implemented.");
  }

  onLoginSuccess(authInfo: AuthInfo): void {}
  onLogout(): void {}
}

export class ClientRequestContext implements IRequestContext {
  refreshHandle?: number;
  isServer = false;

  _accessToken: string | undefined;
  _expiresIn: number | undefined;
  _refreshToken: string | undefined;
  _refreshExpiresIn: number | undefined;

  constructor() {
    this._accessToken = Cookies.get("accessToken");
  }
  get accessToken(): string | undefined {
    return this._accessToken;
  }
  set accessToken(value: string | undefined) {
    value ? Cookies.set("accessToken", value) : Cookies.remove("accessToken");
    this._accessToken = value;
  }
  get expiresIn(): number | undefined {
    return this._expiresIn;
  }
  set expiresIn(value: number | undefined) {
    value
      ? Cookies.set("expiresIn", value.toString())
      : Cookies.remove("expiresIn");
    this._expiresIn = value;
  }
  get refreshToken(): string | undefined {
    return this._refreshToken;
  }
  set refreshToken(value: string | undefined) {
    value ? Cookies.set("refreshToken", value) : Cookies.remove("refreshToken");
    this._refreshToken = value;
  }
  get refreshExpiresIn(): number | undefined {
    return this._refreshExpiresIn;
  }
  set refreshExpiresIn(value: number | undefined) {
    value
      ? Cookies.set("refreshExpiresIn", value.toString())
      : Cookies.remove("refreshExpiresIn");
    this._refreshExpiresIn = value;
  }

  onLoginSuccess(authInfo: AuthInfo): void {
    this.accessToken = authInfo.accessToken;
    this.expiresIn = authInfo.expiresIn;
    this.refreshToken = authInfo.refreshToken;
    this.refreshExpiresIn = authInfo.refreshExpiresIn;

    this.refreshHandle = setTimeout(() => {
      alert("refresh");
    }, authInfo.expiresIn) as unknown as number;
  }

  onLogout(): void {
    console.log("onLogout");

    this.accessToken = undefined;
    this.expiresIn = undefined;
    this.refreshToken = undefined;
    this.refreshExpiresIn = undefined;
    this.refreshHandle && clearTimeout(this.refreshHandle);
  }
}
