import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export default function useUser() {
  const queryClient = useQueryClient();
  const supabaseClient = useSupabaseClient();

  const getUser = async () => {
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();

    if (userError) {
      throw new Error(userError.message);
    }

    const { data, error } = await supabaseClient
      .from("user")
      .select("*")
      .eq("id", user?.id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    if (!data) {
      throw new Error("User not found");
    }

    return data;
  };

  return useQuery(["user"], () => getUser(), {
    refetchOnWindowFocus: false,
    retry: false,
  });
}
