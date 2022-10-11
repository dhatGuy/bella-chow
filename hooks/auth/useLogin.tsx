import { useMutation } from "@tanstack/react-query";
import Router from "next/router";
import { supabase } from "~lib/api";

interface LoginProps {
  email: string;
  password: string;
}

const useLogin = () => {
  const login = async ({ email, password }: LoginProps) => {
    try {
      let { user, error } = await supabase.auth.signIn({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      return user;
    } catch (error) {
      throw error;
    }
  };

  return useMutation((data: LoginProps) => login(data), {
    async onSuccess(user) {
      Router.push("/");
    },
    onError(error, variables, context) {
      console.log(error);
    },
  });
};

export default useLogin;
