import { useToast } from "@chakra-ui/react";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CartItemWithMenu, CartWithItemAndMenu, Menus } from "~types";
import useGetCart from "./useGetCart";

type AddToCartProps = {
  menu: Menus;
  qty?: number;
};

export default function useAddToCart(cafeId: number) {
  const { data: cart, isSuccess } = useGetCart(cafeId);
  const queryClient = useQueryClient();
  const user = useUser();
  const supabaseClient = useSupabaseClient();
  const toast = useToast();

  const addToCart = async ({ menu, qty = 1 }: AddToCartProps) => {
    if (!user) throw "You must be logged in to add to cart";
    if (!isSuccess) return;

    const newItem = cart?.cartItems.find(
      (item: CartItemWithMenu) => item.menu_id === menu.id
    );

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

        return data;
      }
    } catch (error) {
      throw error;
    }
  };

  return useMutation((input: AddToCartProps) => addToCart(input), {
    async onMutate(variables) {
      await queryClient.cancelQueries(["cart", cafeId]);

      const previousCart = queryClient.getQueryData<CartWithItemAndMenu>([
        "cart",
        cafeId,
      ]);
      let newCart = previousCart;

      queryClient.setQueryData<CartWithItemAndMenu>(["cart", cafeId], (old) => {
        if (!old) return old;
        const newItem = old?.cartItems.find(
          (item) => item.menu_id === variables.menu.id
        );

        if (newItem) {
          const updateItem: CartItemWithMenu = {
            ...newItem,
            total_price: newItem.total_price + newItem.menu.price,
            qty: newItem.qty + 1,
          };

          newCart = {
            ...old,
            totalAmount: old.totalAmount + variables.menu.price,
            cartItems: old.cartItems.map((item) =>
              item.id === updateItem.id ? updateItem : item
            ),
          };

          return newCart;
        } else {
          newCart = {
            ...old,
            totalAmount: old?.totalAmount + variables.menu.price,
            cartItems: [
              ...old.cartItems,
              {
                id: Math.floor(Math.random() * 100000),
                menu_id: variables.menu.id,
                cart_id: cart!.id,
                total_price: variables.menu.price,
                qty: variables.qty || 1,
                menu: variables.menu,
                createdAt: new Date().toISOString(),
              },
            ],
          };
          return newCart;
        }
      });

      return { previousCart };
    },
    onError: (_err, _newCart, context) => {
      toast({
        title: "Error",
        description: user ? `An error occurred` : `You need to login`,
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top-right",
      });
      if (context?.previousCart) {
        queryClient.setQueryData(["cart", cafeId], context.previousCart);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(["cart", cafeId]);
    },
    mutationKey: ["addToCart", cafeId],
  });
}
