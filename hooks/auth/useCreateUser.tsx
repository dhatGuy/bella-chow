import { useMutation } from "@tanstack/react-query";
import router from "next/router";
import { state } from "~context/state";
import { supabase } from "~lib/api";
import { Users } from "~types/types";

interface CreateUserProps {
  email: string;
  password: string;
  username?: string;
}

const useCreateUser = () => {
  const createUser = async ({ email, password, username }: CreateUserProps) => {
    let { data: findByUsername } = await supabase
      .from<Users>("user")
      .select("*")
      .eq("username", username)
      .maybeSingle();

    if (findByUsername) {
      throw new Error("Username already exists");
    }

    let { user, error } = await supabase.auth.signUp(
      {
        email,
        password,
      },
      {
        data: {
          username,
          email,
        },
      }
    );

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