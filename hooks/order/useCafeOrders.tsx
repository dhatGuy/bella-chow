import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { OrderWithItemsAndMenuAndUser } from "~types";
import { Database } from "~types/supabase";
import useProfile from "../auth/useProfile";

const useCafeOrders = () => {
  const { data: user } = useProfile();
  const supabaseClient = useSupabaseClient<Database>();

  const fetchOrders = async () => {
    if (!user) return [];

    const { data, error } = await supabaseClient
      .from("order")
      .select(`*, items:order_item(*, menu(*)), user(*)`)
      .returns<OrderWithItemsAndMenuAndUser>();
    // RLS: .eq("cafe_id", user.cafeteria.id);

    if (error) {
      throw new Error(error.message);
    }
    return data;
  };

  return useQuery(["orders", user?.cafeteria.id], fetchOrders);
};

export default useCafeOrders;
