import { decode } from "js-base64";
import { graphql, useFragment } from "react-relay";
import { Link } from "yarr";
import { PostCardFragment_post$key } from "./__generated__/PostCardFragment_post.graphql";

const PostFragment = graphql`
  fragment PostCardFragment_post on Post {
    id
    title
    content
    author {
      id
      name
    }
  }
`;

export const PostCard = ({ post }: { post: PostCardFragment_post$key }) => {
  const data = useFragment<PostCardFragment_post$key>(PostFragment, post);

  return (
    <div className="bg-neutral-200 w-full p-4 h-36">
      <Link to={`/post/${data.id}`}>
        <p>id: {data.id}</p>
        <p>decode id: {decode(data.id)}</p>
        <p>title: {data.title}</p>
        <p>content: {data.content}</p>
        <p>author: {data.author?.name}</p>
      </Link>
    </div>
  );
};
