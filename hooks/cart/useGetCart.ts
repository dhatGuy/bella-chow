import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useIsMutating, useQuery } from "@tanstack/react-query";
import { CartWithItemAndMenu } from "~types";

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
        .eq("cafe_id", cafeId)
        .select(`*, cartItems:cart_item(*, menu(*))`)
        .single();

      if (newCartError) throw new Error(newCartError.message);

      return newCart;
    }

    return cart;
  };

  /**
   * this is to prevent the cart update from flashing on the screen
   * happens when the cart is updated(useAddToCart)
   * and the cart query is refetched
   */
  const isMutating = useIsMutating({ mutationKey: ["addToCart", cafeId] });

  return useQuery(
    ["cart", cafeId],
    () => getCart({ userId: user!.id, cafeId }),
    {
      enabled: !!user && isMutating === 0,
      select(data) {
        return {
          ...data,
          totalAmount: data?.cartItems.reduce(
            (acc: number, item) => acc + item.total_price,
            0
          ),
          // sort cart items by date added to prevent cart items from moving around
          cartItems: data?.cartItems.sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          ),
        };
      },
    }
  );
}
