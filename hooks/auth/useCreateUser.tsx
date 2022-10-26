import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { state } from "~context/state";

interface CreateUserProps {
  email: string;
  password: string;
  username?: string;
  role?: "CUSTOMER" | "CAFE_OWNER";
}

const useCreateUser = () => {
  const supabaseClient = useSupabaseClient();
  const router = useRouter();
  const createUser = async ({
    email,
    password,
    username,
    role = "CUSTOMER",
  }: CreateUserProps) => {
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
          role,
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

      user?.user_metadata?.role === "CUSTOMER"
        ? router.push("/")
        : router.push("/admin");
    },
    onError(error) {
      console.log(error);
    },
  });
};

export default useCreateUser;
