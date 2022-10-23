import { useQuery } from "@tanstack/react-query";
import useUser from "~hooks/auth/useUser";
import { supabase } from "~lib/api";
import { OrderWithOrderItems } from "~types/types";

const getOrders = async (userId?: string) => {
  const { data, error } = await supabase
    .from<OrderWithOrderItems>("order")
    .select(`*, orderItems:order_item(*), cafeteria(*)`)
    .filter("user_id", "eq", userId);

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export default function useGetOrders() {
  const { data: user } = useUser();

  return useQuery(["orders"], () => getOrders(user?.id), {
    enabled: !!user,
  });
}
