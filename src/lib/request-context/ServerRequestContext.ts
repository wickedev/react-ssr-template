import { setCookie } from "h3";
import type { ServerResponse } from "http";
import RelayModernEnvironment from "relay-runtime/lib/store/RelayModernEnvironment";
import { AuthInfo } from "../../store/Auth";
import { refresh, RequestContext } from "./RequestContext";
export class ServerRequestContext implements RequestContext {
  isServer = true;

  constructor(
    private readonly cookies: Record<string, string>,
    readonly res: ServerResponse
  ) {}

  get accessToken(): string | undefined {
    return this.cookies["accessToken"];
  }
  set accessToken(value: string | undefined) {}
  get expiresIn(): number | undefined {
    const value = this.cookies["expiresIn"];
    return value ? Number(value) : undefined;
  }
  set expiresIn(value: number | undefined) {}
  get refreshToken(): string | undefined {
    return this.cookies["refreshToken"];
  }
  set refreshToken(value: string | undefined) {}
  get refreshExpiresIn(): number | undefined {
    const value = this.cookies["refreshExpiresIn"];
    return value ? Number(value) : undefined;
  }
  set refreshExpiresIn(value: number | undefined) {}

  get refreshTimeout(): number | undefined {
    return;
  }
  onLoginSuccess(
    authInfo: AuthInfo,
    relayEnvironment: RelayModernEnvironment
  ): void {
    this.setCookie("accessToken", authInfo.accessToken, authInfo.expiresIn);
    this.setCookie("expiresIn", authInfo.expiresIn, authInfo.expiresIn);
    this.setCookie(
      "refreshToken",
      authInfo.refreshToken,
      authInfo.refreshExpiresIn
    );
    this.setCookie(
      "refreshExpiresIn",
      authInfo.refreshExpiresIn,
      authInfo.refreshExpiresIn
    );
  }
  onLogout(): void {}

  refresh(relayEnvironment: RelayModernEnvironment): Promise<void> {
    return refresh(this, relayEnvironment);
  }

  setCookie(name: string, value: string | number, expireSec: number) {
    const v = typeof value === "string" ? value : value.toString();
    setCookie(this.res, name, v, {
      expires: new Date(1_000),
      secure: true,
      sameSite: "strict",
    });
  }
}
