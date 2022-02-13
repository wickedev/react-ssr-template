import { graphql, usePaginationFragment } from "react-relay";
import { HomePostsQuery$data } from "../pages/__generated__/HomePostsQuery.graphql";
import { InfinateScrollGrid } from "./InfinateScrollGrid";
import { PostCard } from "./PostCard";
import { PostsFragment_query$key } from "./__generated__/PostsFragment_query.graphql";
import { PostsQuery } from "./__generated__/PostsQuery.graphql";

interface PostsProps {
  postsRef: HomePostsQuery$data;
}

const PostsFragment = graphql`
  fragment PostsFragment_query on Query
  @argumentDefinitions(
    last: { type: "Int", defaultValue: 10 }
    before: { type: "ID", defaultValue: null }
  )
  @refetchable(queryName: "PostsQuery") {
    posts(last: $last, before: $before)
      @connection(key: "HomePostConnectionFragment_posts") {
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
    PostsFragment,
    postsRef
  );

  return (
    <InfinateScrollGrid
      data={pagination.data.posts.edges}
      endReached={pagination.loadPrevious}
      hasMoreData={pagination.hasPrevious}
      itemContent={(_, post) => {
        return <PostCard key={post.cursor} post={post.node} />;
      }}
    />
  );
};
