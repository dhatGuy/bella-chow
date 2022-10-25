import { useToast } from "@chakra-ui/react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useMutation } from "@tanstack/react-query";
import useClearCart from "~hooks/cart/useClearCart";
import useGetCart from "~hooks/cart/useGetCart";

interface CreateOrderType {
  amount: number;
  paymentRef: string;
  userId: string;
}

export default function useCreateOrder(cafeId: number) {
  const clearCartMutation = useClearCart(cafeId);
  const { data: cart } = useGetCart(cafeId);
  const supabaseClient = useSupabaseClient();
  const toast = useToast();

  const createOrder = async ({
    amount,
    paymentRef,
    userId,
  }: CreateOrderType) => {
    if (!cart) return;
    const { data: order, error: orderError } = await supabaseClient
      .from("order")
      .insert({
        amount,
        user_id: userId,
        payment_ref: paymentRef,
        cafe_id: cafeId,
      })
      .single();

    if (orderError) throw new Error(orderError.message);

    const orderItems = cart?.cartItems.map((item) => ({
      order_id: order?.id,
      total_price: item.total_price,
      menu_id: item.menu_id,
      qty: item.qty,
    }));

    const { data, error } = await supabaseClient
      .from("order_item")
      .insert(orderItems);

    if (error) {
      throw new Error(error?.message);
    }

    return data;
  };

  return useMutation((input: CreateOrderType) => createOrder(input), {
    onSuccess: () => {
      toast({
        title: "Order placed successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      clearCartMutation.mutate(cart!.id);
    },
  });
}
