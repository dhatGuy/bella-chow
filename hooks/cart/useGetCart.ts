import { useQuery } from "@tanstack/react-query";
import { state } from "~context/state";
import useUser from "~hooks/auth/useUser";
import { supabase } from "~lib/api";
import { CartWithItemAndMenu } from "~types/types";

interface IGetCart {
  userId: string;
  cafeId: number;
}
export default function useGetCart(cafeId: number) {
  const { data: user } = useUser();

  const getCart = async ({ userId, cafeId }: IGetCart) => {
    // check if user has cart for this cafe
    const { data: cart, error: cartError } = await supabase
      .from<CartWithItemAndMenu>("cart")
      .select(`*, cartItems: cart_item(*, menu(*))`)
      .eq("user_id", userId)
      .eq("cafe_id", cafeId)
      .single();

    // if error, create a new cart
    if (cartError) {
      const { data: newCart, error: newCartError } = await supabase
        .from<CartWithItemAndMenu>("cart")
        .insert([
          {
            user_id: userId,
            cafe_id: cafeId,
          },
        ])
        .select(`*, cartItems:cart_item(*, menu(*))`)
        .eq("user_id", userId)
        .eq("cafe_id", cafeId)
        .single();

      if (newCartError) throw new Error(newCartError.message);

      return newCart;
    }

    return cart;
  };

  return useQuery(
    ["cart", cafeId],
    () => getCart({ userId: user!.id, cafeId }),
    {
      enabled: !!user,
      onSuccess: (data) => {
        state.cart = data;
      },
    }
  );
}
