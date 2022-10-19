import { useQuery } from "@tanstack/react-query";
import useUser from "~hooks/auth/useUser";
import { supabase } from "~lib/api";
import { OrderWithItemsAndMenu } from "~types/types";

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

export default function useGetOrder(
  initialData: OrderWithItemsAndMenu,
  orderId: number
) {
  const { data: user } = useUser();

  return useQuery(["order", orderId], () => getOrder(orderId), {
    enabled: !!user,
    initialData,
  });
}
