import {
  useSessionContext,
  useSupabaseClient,
} from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { UserWithCafeteria } from "~types";

type UserResponseSuccess = UserWithCafeteria;

export default function useProfile() {
  const { isLoading, session, error: authError } = useSessionContext();
  const supabaseClient = useSupabaseClient();

  const getUser = async () => {
    if (authError || !session) {
      throw new Error("No session");
    }

    const { data, error } = await supabaseClient
      .from("user")
      .select("*, cafeteria:cafeteria!owner_id(*)")
      .eq("id", session.user.id) // though RLS is enable, cafe owner have access to all users
      .single();

    if (error) {
      throw new Error(error.message);
    }

    if (!data) {
      throw new Error("User not found");
    }

    return {
      ...data,
      cafeteria: data?.cafeteria || null,
    } as UserResponseSuccess;
  };

  return useQuery(["profile"], () => getUser(), {
    refetchOnWindowFocus: false,
    retry: false,
    enabled: !isLoading,
  });
}
