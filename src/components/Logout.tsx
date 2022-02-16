import { useAuth } from "../store/AuthContext";

export function Logout() {
  const auth = useAuth();

  return (
    <button
      onClick={auth.onLogout.bind(auth)}
    >
      Logout
    </button>
  );
}
