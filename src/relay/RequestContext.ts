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

  accessToken: string | undefined;
  expiresIn: number | undefined;
  refreshToken: string | undefined;
  refreshExpiresIn: number | undefined;

  constructor() {
    this.accessToken = Cookies.get("accessToken");
    this.expiresIn = Number(Cookies.get("expiresIn"));
    this.refreshToken = Cookies.get("refreshToken");
    this.refreshExpiresIn = Number(Cookies.get("refreshExpiresIn"));
  }

  onLoginSuccess(authInfo: AuthInfo): void {

    Cookies.set("accessToken", authInfo.accessToken, {
      expires: authInfo.expiresIn,
      secure: true,
      sameSite: 'Strict',
    })

    Cookies.set("expiresIn", authInfo.expiresIn.toString(), {
      expires: authInfo.refreshExpiresIn,
      sameSite: 'Strict',
    })

    Cookies.set("refreshToken", authInfo.refreshToken, {
      expires: authInfo.refreshExpiresIn,
      secure: true,
      sameSite: 'Strict',
    })

    Cookies.set("refreshExpiresIn", authInfo.refreshExpiresIn.toString(), {
      expires: authInfo.refreshExpiresIn,
      sameSite: 'Strict',
    })

    this.accessToken = authInfo.accessToken;
    this.expiresIn = authInfo.expiresIn;
    this.refreshToken = authInfo.refreshToken;
    this.refreshExpiresIn = authInfo.refreshExpiresIn;

    this.refreshHandle = setTimeout(() => {
      alert("refresh");
    }, authInfo.expiresIn) as unknown as number;
  }

  onLogout(): void {
    this.accessToken = undefined;
    this.expiresIn = undefined;
    this.refreshToken = undefined;
    this.refreshExpiresIn = undefined;
    this.refreshHandle && clearTimeout(this.refreshHandle);
  }
}
