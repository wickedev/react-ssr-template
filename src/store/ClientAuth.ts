import RelayModernEnvironment from "relay-runtime/lib/store/RelayModernEnvironment";
import { ref } from "valtio";
import { RequestContext } from "../relay/request-context/RequestContext";
import { AuthInfo, hasRole, IAuth } from "./Auth";

export class Auth implements IAuth {
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
