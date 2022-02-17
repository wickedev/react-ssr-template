import RelayModernEnvironment from "relay-runtime/lib/store/RelayModernEnvironment";
import { ref } from "valtio";
import { RequestContext } from "../lib/request-context/RequestContext";
import { Auth, AuthInfo, hasRole } from "./Auth";

export class AuthStore implements Auth {
  isAuthentiated: boolean = false;

  scope: string = "";
  private readonly requestContext: RequestContext;
  constructor(requestContext: RequestContext) {
    this.requestContext = ref(requestContext);
    this.isAuthentiated = requestContext.accessToken != null;
  }

  onLoginSuccess(info: AuthInfo, environment: RelayModernEnvironment): void {
    this.requestContext.onLoginSuccess(info, environment);
    this.isAuthentiated = true;
    this.scope = info.scope;
  }
  onLogout(): void {
    this.requestContext.onLogout();
    this.isAuthentiated = false;
    this.scope = "";
  }

  hasRole(role: string): boolean {
    return hasRole(this.scope, role);
  }
}
