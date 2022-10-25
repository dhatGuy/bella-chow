import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CartItemWithMenu, CartWithItemAndMenu, Menu } from "~types";
import useGetCart from "./useGetCart";

type UpdateCartQtyProps = {
  menuToUpdate: Menu;
  qty?: number;
  action: "+" | "-";
};

export default function useUpdateCartQty(cafeId: number) {
  const { data: cart, isSuccess } = useGetCart(cafeId);
  const queryClient = useQueryClient();
  const supabaseClient = useSupabaseClient();

  const updateCartQty = async ({
    menuToUpdate,
    qty = 1,
    action,
  }: UpdateCartQtyProps): Promise<CartItemWithMenu | undefined> => {
    const cartItem = cart?.cartItems.find(
      (item) => item.menu_id === menuToUpdate.id
    );
    if (!cartItem || !isSuccess) return;

    const { menu, ...updateItem }: CartItemWithMenu = {
      ...cartItem,
      total_price:
        cartItem.total_price +
        (action == "+" ? cartItem.menu.price : -cartItem.menu.price),
      qty: cartItem.qty + (action == "+" ? qty : -qty),
    };

    const { data: updateData, error: updateError } = await supabaseClient
      .from("cart_item")
      .update(updateItem)
      .match({ id: updateItem.id })
      .eq("menu_id", menu.id)
      .eq("cart_id", cart?.id)
      .select(`*, menu(*)`)
      .single();

    if (updateError) {
      throw new Error(updateError.message);
    }

    return updateData;
  };

  return useMutation((input: UpdateCartQtyProps) => updateCartQty(input), {
    onMutate(variables) {
      queryClient.cancelQueries(["cart", cafeId]);

      const previousCart = queryClient.getQueryData<CartWithItemAndMenu>([
        "cart",
        cafeId,
      ]);

      queryClient.setQueryData<CartWithItemAndMenu>(["cart", cafeId], (old) => {
        const item = old?.cartItems.find(
          (item) => item.menu_id === variables.menuToUpdate.id
        );
        if (!old || !item) return old;

        return {
          ...old,
          totalAmount:
            old.totalAmount +
            (variables.action == "+" ? item.menu.price : -item.menu.price),
          cartItems: old.cartItems.map((item) =>
            item.menu_id === variables.menuToUpdate.id
              ? {
                  ...item,
                  total_price:
                    item.total_price +
                    (variables.action == "+"
                      ? item.menu.price
                      : -item.menu.price),
                  qty: variables.action == "+" ? item.qty + 1 : item.qty - 1,
                }
              : item
          ),
        };
      });

      return { previousCart };
    },
    onError(_error, _variables, context) {
      if (context?.previousCart) {
        queryClient.setQueryData(["cart", cafeId], context.previousCart);
      }
    },
    onSettled() {
      queryClient.invalidateQueries(["cart", cafeId]);
    },
  });
}
