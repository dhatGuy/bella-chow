import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useMutation } from "@tanstack/react-query";
import router from "next/router";
import { state } from "~context/state";

interface CreateUserProps {
  email: string;
  password: string;
  username?: string;
}

const useCreateUser = () => {
  const supabaseClient = useSupabaseClient();
  const createUser = async ({ email, password, username }: CreateUserProps) => {
    let { data: findByUsername } = await supabaseClient
      .from("user")
      .select("*")
      .eq("username", username)
      .maybeSingle();

    if (findByUsername) {
      throw new Error("Username already exists");
    }

    let {
      data: { user },
      error,
    } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          email,
        },
      },
    });

    if (error) {
      throw new Error(`${error.message}`);
    }

    return user;
  };

  return useMutation((data: CreateUserProps) => createUser(data), {
    onSuccess(user) {
      state.user = user;

      router.push("/");
    },
    onError(error) {
      console.log(error);
    },
  });
};

export default useCreateUser;
