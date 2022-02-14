import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { graphql, useMutation } from "react-relay";
import { useNavigation } from "yarr";
import * as yup from "yup";
import { Content } from "../components/Content";
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

export function LoginPage() {
  const [commit, isInFlight] = useMutation<LoginMutation>(graphql`
    mutation LoginMutation($email: String!, $password: String!) {
      login(email: $email, password: $password) {
         accessToken
         refreshToken
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
  const navigation = useNavigation();
  const onSubmit = (data: LoginInput) => {
    commit({
      variables: {
        ...data,
      },
      onCompleted: (response, errors) => {
        navigation.push("/");
      },
      onError: (error) => {
        setError("password", {
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
    </Content>
  );
}
