import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { CartItemWithMenu, CartWithItemAndMenu } from "~types";

interface GetCart {
  userId: string;
  cafeId: number;
}
export default function useGetCart(cafeId: number) {
  const user = useUser();
  const supabaseClient = useSupabaseClient();

  const getCart = async ({
    userId,
    cafeId,
  }: GetCart): Promise<CartWithItemAndMenu> => {
    // check if user has cart for this cafe
    const { data: cart, error: cartError } = await supabaseClient
      .from("cart")
      .select(`*, cartItems: cart_item(*, menu(*))`)
      .eq("user_id", userId)
      .eq("cafe_id", cafeId)
      .single();

    // if error, create a new cart
    if (cartError) {
      const { data: newCart, error: newCartError } = await supabaseClient
        .from("cart")
        .insert([
          {
            user_id: userId,
            cafe_id: cafeId,
          },
        ])
        .eq("user_id", userId)
        .eq("cafe_id", cafeId)
        .select(`*, cartItems:cart_item(*, menu(*))`)
        .single();

      if (newCartError) throw new Error(newCartError.message);

      return newCart;
    }

    return {
      ...cart,
      totalAmount: cart?.cartItems.reduce(
        (acc: number, item: CartItemWithMenu) => acc + item.total_price,
        0
      ),
    };
  };

  return useQuery(
    ["cart", cafeId],
    () => getCart({ userId: user!.id, cafeId }),
    {
      enabled: !!user,
    }
  );
}
