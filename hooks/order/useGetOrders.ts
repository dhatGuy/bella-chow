import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import useProfile from "~hooks/auth/useProfile";
import { Database } from "~types/supabase";

export default function useGetOrders() {
  const { data: user } = useProfile();
  const supabaseClient = useSupabaseClient<Database>();

  const getOrders = async (userId?: string) => {
    const { data, error } = await supabaseClient
      .from("order")
      .select(`*, orderItems:order_item(*), cafeteria(*)`);
    // RLS will only return the order if the user is the owner

    if (error) {
      throw new Error(error.message);
    }

    return data;
  };

  return useQuery(["orders"], () => getOrders(user?.id), {
    enabled: !!user,
  });
}
