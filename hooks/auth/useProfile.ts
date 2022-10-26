import { useSessionContext } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";

export default function useProfile() {
  const { session, error: authError, supabaseClient } = useSessionContext();

  const getUser = async () => {
    if (authError || !session) {
      throw new Error("No session");
    }

    const { data, error } = await supabaseClient
      .from("user")
      .select("*")
      .single();

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
