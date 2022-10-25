import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import calculateCartTotal from "~utils/calculateCartTotal";

export default function useClearCart(cafeId: number) {
  const queryClient = useQueryClient();
  const supabaseClient = useSupabaseClient();

  const clearCart = async (cartId: number) => {
    const res = await supabaseClient
      .from("cart_item")
      .delete()
      .match({ cart_id: cartId });

    if (res.error) {
      throw new Error(res.error.message);
    }

    await calculateCartTotal(cartId);
    return res.data;
  };

  return useMutation((cartId: number) => clearCart(cartId), {
    onSuccess: () => {
      queryClient.invalidateQueries(["cart", cafeId]);
    },
  });
}
