import { commitMutation, graphql } from "react-relay";
import RelayModernEnvironment from "relay-runtime/lib/store/RelayModernEnvironment";
import { AuthInfo } from "../../store/Auth";
import { RequestContextRefreshMutation } from "./__generated__/RequestContextRefreshMutation.graphql";

export interface RequestContext {
  isServer: boolean;
  accessToken?: string;
  expiresIn?: number;
  refreshToken?: string;
  refreshExpiresIn?: number;

  get refreshTimeout(): number | undefined;
  onLoginSuccess(
    authInfo: AuthInfo,
    relayEnvironment: RelayModernEnvironment
  ): void;

  onLogout(): void;
  refresh(relayEnvironment: RelayModernEnvironment): Promise<void>;
}

export const MILLS_PER_SECOND = 1000;

export function refresh(
  requestContext: RequestContext,
  relayEnvironment: RelayModernEnvironment
): Promise<void> {
  return new Promise((resolve) => {
    console.log("refresh");
    if (!requestContext.refreshToken) {
      return resolve();
    }

    const accessToken = (requestContext.accessToken = undefined);
    const expiresIn = (requestContext.expiresIn = undefined);

    commitMutation<RequestContextRefreshMutation>(relayEnvironment, {
      mutation: graphql`
        mutation RequestContextRefreshMutation($token: String!) {
          refresh(token: $token) {
            accessToken
            expiresIn
            refreshToken
            refreshExpiresIn
            scope
          }
        }
      `,
      variables: {
        token: requestContext.refreshToken,
      },
      onCompleted: (response) => {
        requestContext.onLoginSuccess(response.refresh, relayEnvironment);
        resolve();
      },
      onError: (error) => {
        requestContext.accessToken = accessToken;
        requestContext.expiresIn = expiresIn;
        resolve();
      },
    });
  });
}
