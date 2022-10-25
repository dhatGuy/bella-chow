import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";

interface LoginProps {
  email: string;
  password: string;
}

const useLogin = () => {
  const Router = useRouter();
  const supabaseClient = useSupabaseClient();

  const login = async ({ email, password }: LoginProps) => {
    let {
      data: { user },
      error,
    } = await supabaseClient.auth.signInWithPassword({
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
