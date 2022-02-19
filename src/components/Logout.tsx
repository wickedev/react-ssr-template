import { useRelayEnvironment } from "react-relay";
import { useAuth } from "../store/AuthContext";

export function Logout() {
  const enviroment = useRelayEnvironment();
  const auth = useAuth();

  const handleLogout = () => {
    enviroment.commitUpdate((store) => {
      store.getRoot().getLinkedRecord("myInfo")?.invalidateRecord();
      enviroment.getStore().notify();
    });

    auth.onLogout();
  };

  return <button onClick={handleLogout}>Logout</button>;
}
