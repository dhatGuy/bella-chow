import { useAuth } from "@context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "~lib/api";

const useCafeOrders = () => {
  const { user } = useAuth();
  const fetchOrders = async () => {
    if (user) {
      const { data, error } = await supabase
        .from("order")
        .select(`*, menu(*), user:users(*)`)
        .filter("cafe_id", "eq", user?.cafe[0].id);
      if (error) {
        throw new Error(error);
      }
      return data;
    }
  };
  return useQuery(["orders", user], fetchOrders);
};

export default useCafeOrders;
