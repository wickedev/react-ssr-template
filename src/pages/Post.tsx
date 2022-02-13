import { Helmet } from "react-helmet-async";
import { graphql, PreloadedQuery, usePreloadedQuery } from "react-relay";
import { RouteProps } from "yarr";
import { Content } from "../components/Content";
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

  return (
    <Content>
      <Helmet>
        <title>{data.node?.title}</title>
      </Helmet>
      {JSON.stringify(data.node, null, 2)}
    </Content>
  );
}
