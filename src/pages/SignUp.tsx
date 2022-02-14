import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { graphql, useMutation } from "react-relay";
import { useNavigation } from "yarr";
import * as yup from "yup";
import { Content } from "../components/Content";
import { SignUpMutation } from "./__generated__/SignUpMutation.graphql";

interface SignUpInput {
  email: string;
  password: string;
}

const schema = yup
  .object({
    email: yup.string().email().required("Email Required"),
    password: yup
      .string()
      .required("Password Required")
      .notOneOf([yup.ref("email")]),
  })
  .required();

export function SignUpPage() {
  const [commit, isInFlight] = useMutation<SignUpMutation>(graphql`
    mutation SignUpMutation(
      $email: String!
      $name: String
      $password: String!
    ) {
      signUp(email: $email, name: $name, password: $password) {
        id
      }
    }
  `);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpInput>({
    resolver: yupResolver(schema),
  });
  const navigation = useNavigation();
  const onSubmit = (data: SignUpInput) => {
    commit({
      variables: {
        ...data,
        name: null,
      },
      onCompleted: (response, errors) => {
        if (!errors) {
            navigation.push('/')
        }
      },
    });
  };

  return (
    <Content>
      <form
        className="flex flex-col w-72 pt-16 gap-y-2"
        onSubmit={handleSubmit(onSubmit)}
      >
        <input
          className="font-sans block text-sm leading-5 w-full py-2 px-3 border-2 border-slate-600 text-slate-500 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-slate-200"
          placeholder="email"
          type="email"
          {...register("email")}
        />
        <p className="font-sans text-sm text-rose-600">
          {errors.email?.message}
        </p>
        <input
          className="font-sans block text-sm leading-5 w-full py-2 px-3 border-2 border-slate-600 text-slate-500 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-slate-200"
          placeholder="password"
          type="password"
          {...register("password")}
        />
        <p className="font-sans text-sm text-rose-600">
          {errors.password?.message}
        </p>
        <button type="submit" disabled={isInFlight}>
          {isInFlight ? "Loading..." : "Sign Up"}
        </button>
      </form>
    </Content>
  );
}
