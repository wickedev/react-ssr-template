import RelayModernEnvironment from "relay-runtime/lib/store/RelayModernEnvironment";

export interface Auth {
  userId?: string;
  isAuthentiated: boolean;
  scope: string;
  onLoginSuccess(info: AuthInfo, environment: RelayModernEnvironment): void;
  onLogout(): void;
  hasRole(role: string): boolean;
}

export interface AuthInfo {
  userId: string;
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
  refreshExpiresIn: number;
  scope: string;
}

export function hasRole(scope: string, role: string) {
  return scope.search(role) > 0;
}
