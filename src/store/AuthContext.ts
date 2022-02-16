import React, { useContext } from "react";
import { IAuth } from "./Auth";

export const AuthContext = React.createContext<IAuth>({
  isAuthentiated: false,
  scope: "",
  onLoginSuccess: () => {},
  onLogout: () => {},
  hasRole: (role: string) => false,
});

export function useAuth() {
  return useContext(AuthContext);
}
