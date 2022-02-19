import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { graphql, useMutation, useRelayEnvironment } from "react-relay";
import { Link, useNavigation } from "yarr";
import * as yup from "yup";
import { Content } from "../components/Content";
import { useAuth } from "../store/AuthContext";
import { LoginMutation } from "./__generated__/LoginMutation.graphql";

interface LoginInput {
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

export default function LoginPage() {
  const environment = useRelayEnvironment();
  const auth = useAuth();
  const navigation = useNavigation();
  const [commit, isInFlight] = useMutation<LoginMutation>(graphql`
    mutation LoginMutation($email: String!, $password: String!) {
      login(email: $email, password: $password) {
        __typename
        ... on AuthResponseWithID {
          userId
          accessToken
          expiresIn
          refreshToken
          refreshExpiresIn
          scope
        }
        ... on InvalidEmailOrPasswordError {
          message
        }
      }
    }
  `);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: LoginInput) => {
    commit({
      variables: {
        ...data,
      },
      onCompleted: (response, errors) => {
        if (response.login.__typename === "AuthResponseWithID") {
          environment.commitUpdate((store) => {
            store.getRoot().getLinkedRecord("myInfo")?.invalidateRecord();
          });
          auth.onLoginSuccess(response.login, environment);
          navigation.push("/");
        } else if (
          response.login.__typename === "InvalidEmailOrPasswordError"
        ) {
          setError("password", {
            message: response.login.message,
          });
        }
      },
    });
  };

  return (
    <Content className="gap-y-8">
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
        <p className="pl-2 font-sans text-sm text-rose-600">
          {errors.email?.message}
        </p>
        <input
          className="font-sans block text-sm leading-5 w-full py-2 px-3 border-2 border-slate-600 text-slate-500 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-slate-200"
          placeholder="password"
          type="password"
          {...register("password")}
        />
        <p className="pl-2 font-sans text-sm text-rose-600">
          {errors.password?.message}
        </p>
        <button type="submit" disabled={isInFlight}>
          {isInFlight ? "Loading..." : "Login"}
        </button>
      </form>
      <Link to="/sign-up">Go To Sign Up</Link>
    </Content>
  );
}
