import { encode } from "js-base64";
import { Suspense } from "react";
import {
  graphql,
  PreloadedQuery,
  useFragment,
  usePreloadedQuery,
} from "react-relay";
import { useSnapshot } from "valtio";
import { Link, RouteProps } from "yarr";
import { Posts, postsFragment } from "../components/Posts";
import { PostsFragment_query$key } from "../components/__generated__/PostsFragment_query.graphql";
import { useAuth } from "../store/AuthContext";
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
  const auth = useSnapshot(useAuth());

  const postsRef = usePreloadedQuery<HomePostsQuery>(
    homePostsQuery,
    preloaded.query
  );

  const fragmentData = useFragment<PostsFragment_query$key>(
    postsFragment,
    postsRef
  );
  const connectionID = fragmentData.posts.__id;

  return (
    <Suspense
      fallback={<div className="w-full m-8 text-center">Loading...?</div>}
    >
      {auth.isAuthentiated && (
        <div className="flex justify-end px-4 pt-2">
          <Link to={`/post/new?cid=${encode(connectionID)}`}>New Post</Link>
        </div>
      ) }
      <Posts postsRef={postsRef} />
    </Suspense>
  );
}
