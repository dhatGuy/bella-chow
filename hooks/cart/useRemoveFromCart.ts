import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "~lib/api";
import { CartItem } from "~types/types";
import calculateCartTotal from "~utils/calculateCartTotal";

const removeFromCart = async (cartItemId: number) => {
  const { data, error } = await supabase
    .from<CartItem>("cart_item")
    .delete()
    .eq("id", cartItemId);

  if (error) {
    throw new Error(error.message);
  }

  await calculateCartTotal(data[0].cart_id);
  return data;
};

export default function useRemoveFromCart(cafeId: number) {
  const queryClient = useQueryClient();

  return useMutation((cartItemId: number) => removeFromCart(cartItemId), {
    onSuccess: () => {
      queryClient.invalidateQueries(["cart", cafeId]);
    },
  });
}
