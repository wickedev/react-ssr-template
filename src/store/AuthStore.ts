import RelayModernEnvironment from "relay-runtime/lib/store/RelayModernEnvironment";
import { ref } from "valtio";
import { RequestContext } from "../lib/request-context/RequestContext";
import { Auth, AuthInfo, hasRole, LoginInfo } from "./Auth";

export class AuthStore implements Auth {
  userId?: string = undefined;
  isAuthentiated: boolean = false;

  scope: string = "";
  private readonly requestContext: RequestContext;
  constructor(requestContext: RequestContext) {
    this.requestContext = ref(requestContext);
    this.userId = requestContext.userId;
    this.isAuthentiated = requestContext.accessToken != null;
  }

  onLoginSuccess(info: LoginInfo, environment: RelayModernEnvironment): void {
    this.requestContext.onLoginSuccess(info, environment);
    this.userId = info.userId;
    this.isAuthentiated = true;
    this.scope = info.scope;
  }

  onRefreshSuccess(info: AuthInfo, environment: RelayModernEnvironment): void {
    this.requestContext.onLoginSuccess(info, environment);
    this.isAuthentiated = true;
    this.scope = info.scope;
  }

  onLogout(): void {
    this.requestContext.onLogout();
    this.userId = undefined;
    this.isAuthentiated = false;
    this.scope = "";
  }

  hasRole(role: string): boolean {
    return hasRole(this.scope, role);
  }
}
