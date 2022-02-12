import { graphql, PreloadedQuery, usePreloadedQuery } from "react-relay";
import { RouteProps } from "yarr";
import { PostQuery } from "./__generated__/PostQuery.graphql";

export interface PostPageProps extends RouteProps<"/"> {
  preloaded: {
    query: PreloadedQuery<PostQuery>;
  };
}

export const postQuery = graphql`
  query PostQuery($id: ID!) {
    node(id: $id) {
      ... on Post {
        id
        title
        content
      }
    }
  }
`;
export function PostPage({ preloaded }: PostPageProps) {
  const data = usePreloadedQuery(postQuery, preloaded.query);

  return <div>{JSON.stringify(data.node, null, 2)}</div>;
}
