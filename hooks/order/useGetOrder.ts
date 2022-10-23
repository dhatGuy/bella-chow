import { useQuery } from "@tanstack/react-query";
import { supabase } from "~lib/api";
import { OrderWithItemsAndMenu } from "~types";

const getOrder = async (orderId: number) => {
  const { data, error } = await supabase
    .from<OrderWithItemsAndMenu>("order")
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

export default function useGetOrder(orderId: number) {
  return useQuery(["order", orderId], () => getOrder(orderId));
}
