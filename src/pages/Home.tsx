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
import { Progress } from "../components/Progress";
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

export default function HomePage({ preloaded }: HomePageProps) {
  console.log("HomePage");

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
    <Suspense fallback={<Progress />}>
      {auth.isAuthentiated && (
        <div className="flex justify-end px-4 pt-2">
          <Link to={`/post/new?cid=${encode(connectionID)}`}>New Post</Link>
        </div>
      )}
      <Posts postsRef={postsRef} />
    </Suspense>
  );
}
