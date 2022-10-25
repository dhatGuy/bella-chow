import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CartWithItemAndMenu } from "~types";

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

    return res.data;
  };

  return useMutation((cartId: number) => clearCart(cartId), {
    async onMutate() {
      await queryClient.cancelQueries(["cart", cafeId]);

      const previousCart = queryClient.getQueryData<CartWithItemAndMenu>([
        "cart",
        cafeId,
      ]);

      queryClient.setQueryData<CartWithItemAndMenu>(["cart", cafeId], (old) => {
        if (!old) return old;

        return {
          ...old,
          totalAmount: 0,
          cartItems: [],
        };
      });

      return { previousCart };
    },
    onError(_error, _cartId, context) {
      if (context?.previousCart) {
        queryClient.setQueryData(["cart", cafeId], context.previousCart);
      }
    },
    onSettled() {
      queryClient.invalidateQueries(["cart", cafeId]);
    },
  });
}
