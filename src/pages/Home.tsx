import { graphql, useLazyLoadQuery } from "react-relay";
import type { HomeTestQuery as HomeTestQueryType } from "./__generated__/HomeTestQuery.graphql";

const HomeTestQuery = graphql`
  query HomeTestQuery($last: Int, $before: ID) {
    posts(last: $last, before: $before) {
      edges {
        node {
          id
          title
          content
        }
      }
    }
  }
`;

export function HomePage() {
  const data = useLazyLoadQuery<HomeTestQueryType>(HomeTestQuery, {
    last: null,
    before: null,
  });

  return (
    <div>
      <h1>Home</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
