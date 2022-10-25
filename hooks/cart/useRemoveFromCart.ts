import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import calculateCartTotal from "~utils/calculateCartTotal";

export default function useRemoveFromCart(cafeId: number) {
  const queryClient = useQueryClient();
  const supabaseClient = useSupabaseClient();

  const removeFromCart = async (cartItemId: number) => {
    const { data, error } = await supabaseClient
      .from("cart_item")
      .delete()
      .eq("id", cartItemId);

    if (error) {
      throw new Error(error.message);
    }

    await calculateCartTotal(data[0].cart_id);
    return data;
  };

  return useMutation((cartItemId: number) => removeFromCart(cartItemId), {
    onSuccess: () => {
      queryClient.invalidateQueries(["cart", cafeId]);
    },
  });
}
