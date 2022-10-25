import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import useProfile from "./auth/useProfile";

const useCafeOrders = () => {
  const { data: user } = useProfile();
  const supabaseClient = useSupabaseClient();
  const fetchOrders = async () => {
    if (user) {
      const { data, error } = await supabaseClient
        .from("order")
        .select(`*, menu(*), user:user(*)`);
      // .filter("cafe_id", "eq", user?.cafe[0].id);
      if (error) {
        throw new Error(error.message);
      }
      return data;
    }
  };

  return useQuery(["orders", user], fetchOrders);
};

export default useCafeOrders;
