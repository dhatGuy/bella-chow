import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "~lib/api";
import { CartItem } from "~types/types";
import calculateCartTotal from "~utils/calculateCartTotal";

const clearCart = async (cartId: number) => {
  const res = await supabase
    .from<CartItem>("cart_item")
    .delete()
    .match({ cart_id: cartId });

  if (res.error) {
    throw new Error(res.error.message);
  }

  console.log(res);
  await calculateCartTotal(cartId);
  return res.data;
};

export default function useClearCart() {
  const queryClient = useQueryClient();

  return useMutation((cartId: number) => clearCart(cartId), {
    onSuccess: () => {
      queryClient.invalidateQueries(["cart"]);
    },
  });
}
