import { graphql, PreloadedQuery, usePreloadedQuery } from "react-relay";
import { RouteProps } from "yarr";
import { Posts } from "../components/Posts";
import { HomePostsQuery } from "./__generated__/HomePostsQuery.graphql";

export interface HomePageProps extends RouteProps<"/"> {
  preloaded: {
    query: PreloadedQuery<HomePostsQuery>;
  };
}
export const homePostsQuery = graphql`
  query HomePostsQuery {
    ...PostsFragment_query
  }
`;

export function HomePage({ preloaded }: HomePageProps) {
  const postsRef = usePreloadedQuery<HomePostsQuery>(
    homePostsQuery,
    preloaded.query
  );

  return (
    <div>
      <h1>Home</h1>
      <Posts postsRef={postsRef} />
    </div>
  );
}
