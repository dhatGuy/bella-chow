import { useQuery } from "@tanstack/react-query";
import { supabase } from "~lib/api";
import useUser from "./auth/useUser";

const useCafeOrders = () => {
  const { data: user } = useUser();
  const fetchOrders = async () => {
    if (user) {
      const { data, error } = await supabase
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
