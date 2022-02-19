import { Helmet } from "react-helmet-async";
import {
  graphql,
  PreloadedQuery,
  useMutation,
  usePreloadedQuery
} from "react-relay";
import { RouteProps, useNavigation } from "yarr";
import { Content } from "../components/Content";
import { message } from "../lib/error-message-in-source";
import { useAuthSnapshot } from "../store/AuthContext";
import { PostDeleteMutation } from "./__generated__/PostDeleteMutation.graphql";
import { PostQuery } from "./__generated__/PostQuery.graphql";

export interface PostPageProps extends RouteProps<"/"> {
  preloaded: {
    query: PreloadedQuery<PostQuery>;
  };
}

export const postQuery = graphql`
  query PostQuery($id: ID!) {
    post(id: $id) {
      id
      title
      content
      author {
        id
      }
    }
  }
`;
export default function PostPage({ preloaded }: PostPageProps) {
  const auth = useAuthSnapshot();
  const data = usePreloadedQuery<PostQuery>(postQuery, preloaded.query);
  const navigation = useNavigation();
  const [commit, isInFlight] = useMutation<PostDeleteMutation>(graphql`
    mutation PostDeleteMutation($id: ID!) {
      postDelete(id: $id) @deleteRecord
    }
  `);

  if (isInFlight) {
    return <div className="w-full m-8 text-center">Deleting...</div>;
  }

  if (!data.post) {
    return <div>No Data</div>;
  }

  return (
    <Content>
      <Helmet>
        <title>{data.post?.title}</title>
      </Helmet>
      {JSON.stringify(data.post, null, 2)}
      {auth.userId === data.post.author?.id && (
        <button
          onClick={() => {
            commit({
              variables: {
                id: data.post?.id!!,
              },
              onCompleted: () => {
                navigation.push("/");
              },
              onError: (error) => {
                alert(message(error));
              },
            });
          }}
        >
          delete
        </button>
      )}
    </Content>
  );
}
