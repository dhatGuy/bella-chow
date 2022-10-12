import { User } from "@supabase/supabase-js";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "~lib/api";
import { Users } from "~types/types";

const getUser = async (user: User | null) => {
  const { data, error } = await supabase
    .from<Users>("user")
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

export default function useUser() {
  const queryClient = useQueryClient();
  const user = supabase.auth.user();
  return useQuery(["user"], () => getUser(user), {
    refetchOnWindowFocus: false,
    retry: false,
  });
}
