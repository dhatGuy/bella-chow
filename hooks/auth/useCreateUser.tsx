import {
  SupabaseClient,
  useSupabaseClient,
} from "@supabase/auth-helpers-react";
import { useMutation } from "@tanstack/react-query";
import { state } from "~context/state";
import { Database } from "~types/supabase";

interface CreateUserProps {
  email: string;
  password: string;
  username?: string;
  role?: Database["public"]["Enums"]["role"];
}

export const createUser = async (
  supabaseClient: SupabaseClient,
  { email, password, username, role = "CUSTOMER" }: CreateUserProps
) => {
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
const useCreateUser = () => {
  const supabaseClient = useSupabaseClient();

  return useMutation(
    (data: CreateUserProps) => createUser(supabaseClient, data),
    {
      onSuccess(user) {
        state.user = user;
      },
      onError(error) {
        console.log(error);
      },
    }
  );
};

export default useCreateUser;
