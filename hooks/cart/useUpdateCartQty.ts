import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "~lib/api";
import { CartItemWithMenu, Menu } from "~types";
import calculateCartTotal from "~utils/calculateCartTotal";
import useGetCart from "./useGetCart";

type UpdateCartQtyProps = {
  menuToUpdate: Menu;
  qty?: number;
  action: "+" | "-";
};

export default function useUpdateCartQty(cafeId: number) {
  const { data: cart, isSuccess } = useGetCart(cafeId);
  const queryClient = useQueryClient();

  const updateCartQty = async ({
    menuToUpdate,
    qty = 1,
    action,
  }: UpdateCartQtyProps) => {
    const cartItem = cart?.cartItems.find(
      (item) => item.menu_id === menuToUpdate.id
    );
    if (!cartItem || !isSuccess) return;

    const { menu, ...updateItem }: CartItemWithMenu = {
      ...cartItem,
      total_price: cartItem.total_price + cartItem.menu.price,
      qty: action == "+" ? cartItem.qty + qty : cartItem.qty - qty,
    };

    const { data: updateData, error: updateError } = await supabase
      .from<CartItemWithMenu>("cart_item")
      .update(updateItem)
      .match({ id: updateItem.id })
      .select(`*, menu(*)`)
      .filter("menu_id", "eq", menu.id)
      .filter("cart_id", "eq", cart?.id)
      .single();

    if (updateError) {
      throw new Error(updateError.message);
    }

    await calculateCartTotal(cart.id);

    return updateData;
  };

  return useMutation((input: UpdateCartQtyProps) => updateCartQty(input), {
    onSuccess: () => {
      queryClient.invalidateQueries(["cart", cafeId]);
    },
  });
}
