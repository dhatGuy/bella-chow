import { Box, Heading, Text } from "@chakra-ui/react";
import { supabase } from "api";
import { useRouter } from "next/router";
import { useMutation, useQuery, useQueryClient } from "react-query";

const Order = ({ data }) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const fetchOrder = async () => {
    const { data, error } = await supabase
      .from("order")
      .select(
        `
        *, user:users(username), orderItems(*, menu(*))
      `
      )
      .eq("id", router.query.id)
      .single();
    if (error) {
      throw new Error(error);
    }
    return data;
  };
  const { data: order } = useQuery("order", fetchOrder, {
    initialData: data,
  });
  const mutation = useMutation(
    (status) => {
      return "hello";
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("order");
      },
    }
  );
  return (
    <Box>
      <h1>Order #{order.id}</h1>
      <Text>{order.user.username}</Text>
      <Text>{order.date}</Text>
      <Text>{order.amount}</Text>
      <Text>{order.status}</Text>
      <Text>{order.payment_ref}</Text>
      <Box>
        <Heading>items</Heading>
        {order.orderItems.map((item) => (
          <Box key={item.id}>
            <Text>{item.menu.name}</Text>
            <Text>{item.menu.price}</Text>
            <Text>{item.qty}</Text>
            <Text>{item.total_price}</Text>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Order;

export const getServerSideProps = async (ctx) => {
  const id = ctx.query.id;
  const { data } = await supabase
    .from("order")
    .select(
      `
        *, user:users(username), orderItems(*, menu(*))
      `
    )
    .eq("id", id)
    .single();

  return {
    props: {
      data,
    },
  };
};
