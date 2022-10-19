import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { supabase } from "~lib/api";

interface LoginProps {
  email: string;
  password: string;
}

const useLogin = () => {
  const Router = useRouter();
  const login = async ({ email, password }: LoginProps) => {
    let { user, error } = await supabase.auth.signIn({
      email,
      password,
    });

    if (error) {
      throw new Error(`${error.message}`);
    }

    return user;
  };

  return useMutation((data: LoginProps) => login(data), {
    onError(error) {
      console.log(error);
    },
  });
};

export default useLogin;
