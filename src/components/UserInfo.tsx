import { graphql, useLazyLoadQuery } from "react-relay";
import { UserInfoQuery } from "./__generated__/UserInfoQuery.graphql";

export function UserInfo() {
  const data = useLazyLoadQuery<UserInfoQuery>(
    graphql`
      query UserInfoQuery {
        myInfo {
          id
          name
          email
        }
      }
    `,
    {}
  );

  return <span className="max-w-xs truncate">Welcome, {data.myInfo?.name}</span>;
}
