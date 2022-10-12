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
    try {
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
          },
        }
      );

      if (error) {
        throw error;
      }

      return user;
    } catch (error) {
      throw error;
    }
  };

  return useMutation((data: CreateUserProps) => createUser(data), {
    async onSuccess(user) {
      state.user = user;

      router.push("/");
    },
    onError(error, variables, context) {
      console.log(error);
    },
  });
};

export default useCreateUser;
