import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";

export default function useProfile() {
  const supabaseClient = useSupabaseClient();

  const getUser = async () => {
    const {
      data: { session },
      error: sessionError,
    } = await supabaseClient.auth.getSession();

    if (sessionError) {
      throw new Error(sessionError.message);
    }

    const { data, error } = await supabaseClient
      .from("user")
      .select("*")
      .single();

    console.log(data);

    if (error) {
      throw new Error(error.message);
    }

    if (!data) {
      throw new Error("User not found");
    }

    return data;
  };

  return useQuery(["profile"], () => getUser(), {
    refetchOnWindowFocus: false,
    retry: false,
  });
}
