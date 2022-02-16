import Cookies from "js-cookie";
import RelayModernEnvironment from "relay-runtime/lib/store/RelayModernEnvironment";
import { AuthInfo } from "../../store/Auth";
import { MILLS_PER_SECOND, refresh, RequestContext } from "./RequestContext";

export class ClientRequestContext implements RequestContext {
  isServer = false;

  accessToken?: string;
  expiresIn?: number;
  refreshToken?: string;
  refreshExpiresIn?: number;
  refreshHandle?: NodeJS.Timeout;

  constructor() {
    this.accessToken = Cookies.get("accessToken");
    this.expiresIn = Number(Cookies.get("expiresIn"));
    this.refreshToken = Cookies.get("refreshToken");
    this.refreshExpiresIn = Number(Cookies.get("refreshExpiresIn"));
    const now = new Date().getTime();

    if (now > this.expiresIn * MILLS_PER_SECOND) {
      this.accessToken = undefined;
      this.expiresIn = undefined;
      Cookies.remove("accessToken");
      Cookies.remove("expiresIn");
    }

    if (now > this.refreshExpiresIn * MILLS_PER_SECOND) {
      this.refreshToken = undefined;
      this.refreshExpiresIn = undefined;
      Cookies.remove("refreshToken");
      Cookies.remove("refreshExpiresIn");
    }
  }

  get refreshTimeout(): number | undefined {
    if (!this.expiresIn) {
      return;
    }

    const now = Math.floor(new Date().getTime());
    return this.expiresIn * MILLS_PER_SECOND - now;
  }

  onLoginSuccess(
    authInfo: AuthInfo,
    relayEnvironment: RelayModernEnvironment
  ): void {
    setCookie("accessToken", authInfo.accessToken, authInfo.expiresIn);
    setCookie("expiresIn", authInfo.expiresIn, authInfo.expiresIn);
    setCookie("refreshToken", authInfo.refreshToken, authInfo.refreshExpiresIn);
    setCookie(
      "refreshExpiresIn",
      authInfo.refreshExpiresIn,
      authInfo.refreshExpiresIn
    );

    this.accessToken = authInfo.accessToken;
    this.expiresIn = authInfo.expiresIn;
    this.refreshToken = authInfo.refreshToken;
    this.refreshExpiresIn = authInfo.refreshExpiresIn;
  }

  onLogout(): void {
    this.accessToken = undefined;
    this.expiresIn = undefined;
    this.refreshToken = undefined;
    this.refreshExpiresIn = undefined;

    Cookies.remove("accessToken");
    Cookies.remove("expiresIn");
    Cookies.remove("refreshToken");
    Cookies.remove("refreshExpiresIn");
  }
  refresh(relayEnvironment: RelayModernEnvironment): Promise<void> {
    return refresh(this, relayEnvironment);
  }

  scheduledRefresh(relayEnvironment: RelayModernEnvironment): void {
    const refreshTimeout = this.refreshTimeout;
    if (!refreshTimeout) {
      return;
    }

    this.refreshHandle = setTimeout(() => {
      this.refresh(relayEnvironment);
    }, refreshTimeout - 30 * 1000);
  }
}

function setCookie(name: string, value: string | number, expiresSec: number) {
  const v = typeof value === "string" ? value : value.toString();
  Cookies.set(name, v, {
    expires: new Date(expiresSec * MILLS_PER_SECOND),
    secure: true,
    sameSite: "Strict",
  });
}
