import { yupResolver } from "@hookform/resolvers/yup";
import { decode } from "js-base64";
import { useForm } from "react-hook-form";
import { graphql, useMutation } from "react-relay";
import { useNavigation } from "yarr";
import * as yup from "yup";
import { Content } from "../components/Content";
import { NewPostMutation } from "./__generated__/NewPostMutation.graphql";
interface NewPostInput {
  title: string;
  content: string;
}

const schema = yup
  .object({
    title: yup.string().required("Title Required"),
    content: yup.string().required("Content Required"),
  })
  .required();

interface NewPostProps {
  search: {
    cid: string;
  };
}
export default function NewPostPage({ search: { cid } }: NewPostProps) {
  const navigation = useNavigation();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<NewPostInput>({
    resolver: yupResolver(schema),
  });

  const [commit, isInFlight] = useMutation<NewPostMutation>(graphql`
    mutation NewPostMutation(
      $connections: [ID!]!
      $title: String!
      $content: String!
    ) {
      postUpload(uploadedPost: { title: $title, content: $content }) {
        post @prependEdge(connections: $connections) {
          node {
            id
            title
            content
          }
          cursor
        }
      }
    }
  `);

  const onSubmit = (data: NewPostInput) => {
    commit({
      variables: {
        ...data,
        connections: [decode(cid)],
      },
      onCompleted: (response, errors) => {
        navigation.push("/");
      },
      onError: (error) => {
        setError("content", {
          message: (error as any).source.errors
            .flatMap((e: any) => Object.values(e.extensions))
            .map((e: any) => e.message)
            .join(", "),
        });
      },
    });
  };

  return (
    <Content>
      <form
        className="flex w-full flex-col p-4 gap-y-2"
        onSubmit={handleSubmit(onSubmit)}
      >
        <input
          className="font-sans block text-sm leading-5 w-full py-2 px-3 border-2 border-slate-600 text-slate-500 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-slate-200"
          placeholder="Title"
          type="text"
          {...register("title")}
        />
        <p className="pl-2 font-sans text-sm text-rose-600">
          {errors.title?.message}
        </p>
        <textarea
          className="font-sans block text-sm leading-5 w-full py-2 px-3 border-2 border-slate-600 text-slate-500 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-slate-200"
          placeholder="Content"
          style={{
            minHeight: "8rem",
          }}
          {...register("content")}
        />
        <p className="pl-2 font-sans text-sm text-rose-600">
          {errors.content?.message}
        </p>
        <button type="submit" disabled={isInFlight}>
          {isInFlight ? "Loading..." : "Register"}
        </button>
      </form>
    </Content>
  );
}
