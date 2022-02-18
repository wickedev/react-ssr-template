import { encode } from "js-base64";
import { Suspense, useState } from "react";
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
  const auth = useSnapshot(useAuth());

  const [search, setSearch] = useState("");

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
    <div>
      {auth.isAuthentiated && (
        <div className="flex justify-end px-4 pt-2">
          <Link to={`/post/new?cid=${encode(connectionID)}`}>New Post</Link>
        </div>
      )}
      <div className="mx-8 mt-4">
        <input
          className="font-sans block text-sm leading-5 w-full py-2 px-3 border-2 border-slate-600 text-slate-500 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-slate-200"
          placeholder="Search"
          type="text"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <Suspense fallback={<Progress />}>
        <Posts postsRef={postsRef} search={search} />
      </Suspense>
    </div>
  );
}
