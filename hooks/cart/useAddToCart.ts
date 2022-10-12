import { useToast } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useUser from "~hooks/auth/useUser";
import { supabase } from "~lib/api";
import { CartItemWithMenu, Menu } from "~types/types";
import calculateCartTotal from "~utils/calculateCartTotal";
import useGetCart from "./useGetCart";

type AddToCartProps = {
  menu: Menu;
  qty?: number;
};

export default function useAddToCart(cafeId: number) {
  const { data: cart, isSuccess } = useGetCart(cafeId);
  const queryClient = useQueryClient();
  const { data: user } = useUser();
  const toast = useToast();

  const addToCart = async ({ menu, qty = 1 }: AddToCartProps) => {
    if (!user) throw "You must be logged in to add to cart";
    if (!isSuccess) return;

    const newItem = cart?.cartItems.find((item) => item.menu_id === menu.id);

    try {
      // update existing cart item
      if (newItem) {
        const { menu, ...updateItem }: CartItemWithMenu = {
          ...newItem,
          total_price: newItem.total_price + newItem.menu.price,
          qty: newItem.qty + qty,
        };

        const { data, error } = await supabase
          .from<CartItemWithMenu>("cart_item")
          .update(updateItem)
          .match({ id: updateItem.id })
          .select(`*, menu(*)`)
          .filter("menu_id", "eq", menu.id)
          .filter("cart_id", "eq", cart?.id)
          .single();

        if (error) throw new Error(error.message);

        await calculateCartTotal(cart.id);
        return data;
      } else {
        const { data, error } = await supabase
          .from<CartItemWithMenu>("cart_item")
          .insert([
            {
              menu_id: menu.id,
              cart_id: cart?.id,
              total_price: menu.price,
              qty,
            },
          ])
          .select(`*, menu(*)`)
          .filter("menu_id", "eq", menu.id)
          .filter("cart_id", "eq", cart?.id)
          .single();

        if (error) throw new Error(error.message);

        await calculateCartTotal(cart.id);
        return data;
      }
    } catch (error) {
      throw error;
    }
  };

  return useMutation((input: AddToCartProps) => addToCart(input), {
    onSuccess: (data, variables) => {
      if (!data) return;

      queryClient.invalidateQueries(["cart", cafeId]);
      toast({
        title: "Added to cart",
        description: `${variables.menu.name} added to cart`,
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "top-right",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: user ? `An error occurred` : `You need to login`,
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top-right",
      });
    },
  });
}
