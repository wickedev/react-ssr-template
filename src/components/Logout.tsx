import { useRequestContext } from "../relay/RequestContext";

export function Logout() {
  const requestContext = useRequestContext();

  return (
    <button
      onClick={requestContext.onLogout.bind(requestContext)}
    >
      Logout
    </button>
  );
}
