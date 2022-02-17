import React, { useContext } from "react";
import { Auth } from "./Auth";

export const AuthContext = React.createContext<Auth>({
  isAuthentiated: false,
  scope: "",
  onLoginSuccess: () => {},
  onLogout: () => {},
  hasRole: (role: string) => false,
});

export function useAuth() {
  return useContext(AuthContext);
}
