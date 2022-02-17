import { useMemo } from "react";
import { graphql, usePaginationFragment } from "react-relay";
import { HomePostsQuery$data } from "../pages/__generated__/HomePostsQuery.graphql";
import { InfinateScrollGrid } from "./InfinateScrollGrid";
import { PostCard } from "./PostCard";
import { PostsFragment_query$key } from "./__generated__/PostsFragment_query.graphql";
import { PostsQuery } from "./__generated__/PostsQuery.graphql";

interface PostsProps {
  postsRef: HomePostsQuery$data;
}

export const postsFragment = graphql`
  fragment PostsFragment_query on Query
  @argumentDefinitions(
    first: { type: "Int", defaultValue: 10 }
    after: { type: "ID", defaultValue: null }
  )
  @refetchable(queryName: "PostsQuery") {
    posts(first: $first, after: $after)
      @connection(key: "HomePostConnectionFragment_posts") {
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

export const Posts = ({ postsRef }: PostsProps) => {
  
  const pagination = usePaginationFragment<PostsQuery, PostsFragment_query$key>(
    postsFragment,
    postsRef
  );

  const edges = useMemo(() => {
    return pagination.data.posts.edges.filter((edge) => edge.node != null);
  }, [pagination.data.posts.edges]);

  if (!edges.length) {
    return <div className="w-full m-16 text-center">There is no posts. Be the first to write</div>;
  }

  pagination.isLoadingNext

  return (
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
  );
};
