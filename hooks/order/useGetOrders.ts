import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import useProfile from "~hooks/auth/useProfile";

export default function useGetOrders() {
  const { data: user } = useProfile();
  const supabaseClient = useSupabaseClient();

  const getOrders = async (userId?: string) => {
    const { data, error } = await supabaseClient
      .from("order")
      .select(`*, orderItems:order_item(*), cafeteria(*)`)
      .filter("user_id", "eq", userId);

    if (error) {
      throw new Error(error.message);
    }

    return data;
  };

  return useQuery(["orders"], () => getOrders(user.id), {
    enabled: !!user,
  });
}
