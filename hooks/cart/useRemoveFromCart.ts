import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CartItem, CartWithItemAndMenu } from "~types";

export default function useRemoveFromCart(cafeId: number) {
  const queryClient = useQueryClient();
  const supabaseClient = useSupabaseClient();

  const removeFromCart = async (cartItemId: number): Promise<CartItem> => {
    const { data, error } = await supabaseClient
      .from("cart_item")
      .delete()
      .eq("id", cartItemId)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  };

  return useMutation((cartItemId: number) => removeFromCart(cartItemId), {
    async onMutate(cartItemId) {
      await queryClient.cancelQueries(["cart", cafeId]);

      const previousCart = queryClient.getQueryData<CartWithItemAndMenu>([
        "cart",
        cafeId,
      ]);

      queryClient.setQueryData<CartWithItemAndMenu>(["cart", cafeId], (old) => {
        const item = old?.cartItems.find((item) => item.id === cartItemId);
        if (!old || !item) return old;

        return {
          ...old,
          totalAmount: old.totalAmount - item.total_price || 0,
          cartItems: old.cartItems.filter(
            (item: any) => item.id !== cartItemId
          ),
        };
      });

      return { previousCart };
    },
    onError(_error, _cartItemId, context) {
      if (context?.previousCart) {
        queryClient.setQueryData(["cart", cafeId], context.previousCart);
      }
    },
    onSettled() {
      queryClient.invalidateQueries(["cart", cafeId]);
    },
  });
}
