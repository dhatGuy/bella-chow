import { useMutation, useQueryClient } from "@tanstack/react-query";
import useClearCart from "~hooks/cart/useClearCart";
import useGetCart from "~hooks/cart/useGetCart";
import { supabase } from "~lib/api";
import { Order } from "~types/types";

interface CreateOrderType {
  amount: number;
  paymentRef: string;
  userId: string;
}

export default function useCreateOrder(cafeId: number) {
  const clearCartMutation = useClearCart(cafeId);
  const { data: cart } = useGetCart(cafeId);
  const queryClient = useQueryClient();

  const createOrder = async ({
    amount,
    paymentRef,
    userId,
  }: CreateOrderType) => {
    const { data: order, error: orderError } = await supabase
      .from<Order>("order")
      .insert({
        amount,
        user_id: userId,
        payment_ref: paymentRef,
        cafe_id: cafeId,
      })
      .single();

    const orderItems = cart.cartItems.map((item) => ({
      order_id: order.id,
      total_price: item.total_price,
      menu_id: item.menu_id,
      qty: item.qty,
    }));

    const { data, error } = await supabase
      .from("order_item")
      .insert(orderItems);

    if (orderError || error) {
      throw new Error(orderError?.message || error?.message);
    }

    return data;
  };

  return useMutation((input: CreateOrderType) => createOrder(input), {
    onSuccess: () => {
      clearCartMutation.mutate(cart.id);
    },
  });
}
