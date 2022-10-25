import { useToast } from "@chakra-ui/react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useUser from "~hooks/auth/useUser";
import { CartItemWithMenu, Menu } from "~types";
import { definitions } from "~types/supabase";
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
  const supabaseClient = useSupabaseClient<definitions>();
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

        const { data, error } = await supabaseClient
          .from("cart_item")
          .update(updateItem)
          .match({ id: updateItem.id })
          .filter("menu_id", "eq", menu.id)
          .filter("cart_id", "eq", cart?.id)
          .select(`*, menu(*)`)
          .single();

        if (error) throw new Error(error.message);

        await calculateCartTotal(cart.id);
        return data;
      } else {
        const { data, error } = await supabaseClient
          .from("cart_item")
          .insert([
            {
              menu_id: menu.id,
              cart_id: cart?.id,
              total_price: menu.price,
              qty,
            },
          ])
          .filter("menu_id", "eq", menu.id)
          .filter("cart_id", "eq", cart?.id)
          .select(`*, menu(*)`)
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
