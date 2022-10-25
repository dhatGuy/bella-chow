import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";

export default function useGetOrder(orderId: number) {
  const supabaseClient = useSupabaseClient();

  const getOrder = async (orderId: number) => {
    const { data, error } = await supabaseClient
      .from("order")
      .select(
        `
        *, items:order_item(*, menu(*))
      `
      )
      .eq("id", orderId)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  };

  return useQuery(["order", orderId], () => getOrder(orderId));
}
