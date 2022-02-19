import { debounce } from "lodash-es";
import { useEffect, useMemo } from "react";
import { graphql, usePaginationFragment } from "react-relay";
import { HomePostsQuery$data } from "../pages/__generated__/HomePostsQuery.graphql";
import { InfinateScrollGrid } from "./InfinateScrollGrid";
import { PostCard } from "./PostCard";
import { PostsFragment_query$key } from "./__generated__/PostsFragment_query.graphql";
import { PostsQuery } from "./__generated__/PostsQuery.graphql";

interface PostsProps {
  postsRef: HomePostsQuery$data;
  search: string;
}

export const postsFragment = graphql`
  fragment PostsFragment_query on Query
  @argumentDefinitions(
    first: { type: "Int", defaultValue: 10 }
    after: { type: "ID", defaultValue: null }
    orderBy: {
      type: "[OrderInput!]"
      defaultValue: [{ property: "id", direction: DESC }]
    }
    search: { type: "String", defaultValue: "" }
  )
  @refetchable(queryName: "PostsQuery") {
    posts(first: $first, after: $after, orderBy: $orderBy, search: $search)
      @connection(
        key: "HomePostConnectionFragment_posts"
        filters: ["search"]
      ) {
      __id
      edges {
        node {
          ...PostCardFragment_post
        }
        cursor
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`;

export const Posts = ({ postsRef, search }: PostsProps) => {
  const pagination = usePaginationFragment<PostsQuery, PostsFragment_query$key>(
    postsFragment,
    postsRef
  );

  const searching = useMemo(
    () =>
      debounce((search: string) => {
        pagination.refetch({
          first: 10,
          after: null,
          orderBy: [{ property: "id", direction: "DESC" }],
          search: search,
        });
      }, 300),
    []
  );

  useEffect(() => {
    searching(search);
  }, [searching, search]);

  const edges = useMemo(() => {
    return pagination.data.posts.edges.filter((edge) => edge.node != null);
  }, [pagination.data.posts.edges]);

  return edges.length ? (
    <InfinateScrollGrid
      data={edges}
      endReached={() => {
        pagination.hasNext && pagination.loadNext(10);
      }}
      hasMoreData={pagination.hasNext}
      isLoadingNext={pagination.isLoadingNext}
      itemContent={(_, post) => {
        return <PostCard key={post.cursor} post={post.node} />;
      }}
    />
  ) : (
    <div className="w-full m-16 text-center">There is no posts.</div>
  );
};
