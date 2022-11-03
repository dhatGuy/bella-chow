import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { OrderWithItemsAndMenuAndUser } from "~types";
import { Database } from "~types/supabase";

export default function useGetOrder(orderId: number) {
  const supabaseClient = useSupabaseClient<Database>();

  const getOrder = async (orderId: number) => {
    const { data, error } = await supabaseClient
      .from("order")
      .select(
        `
        *, items:order_item(*, menu(*)), user(*)
      `
      )
      .eq("id", orderId)
      .returns<OrderWithItemsAndMenuAndUser>()
      .single(); // RLS will only return the order if the user is the owner or cafe owner

    if (error) {
      throw new Error(error.message);
    }

    return data;
  };

  return useQuery(["order", orderId], () => getOrder(orderId));
}
