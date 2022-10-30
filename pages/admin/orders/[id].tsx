import {
  Box,
  Flex,
  Heading,
  Image,
  Table,
  TableCaption,
  Tag,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { withPageAuth } from "@supabase/auth-helpers-nextjs";
import {
  dehydrate,
  QueryClient,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next/types";
import Moment from "react-moment";
import { supabase } from "~lib/api";

const Order = () => {
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
      .eq("id", router.query.id as string)
      .single();
    if (error) {
      throw new Error(error.message);
    }
    return data;
  };
  const { data: order } = useQuery(["order", router.query.id], fetchOrder);

  if (!order) {
    return null;
  }

  return (
    <Box>
      <Heading as="h1">Order Details</Heading>
      <Box boxShadow="md">
        <Text>Order id: #{order.id}</Text>
        {/* TODO: fix type */}
        {/* <Text>Ordered by: {order.user.username}</Text> */}
        <Text>
          Placed on: <Moment format="ddd LL">{order.date}</Moment>
        </Text>
        <Text>Amount: {order.amount}</Text>
        <Text>Payment Ref: {order.payment_ref}</Text>
        <Tag>{order.status}</Tag>
      </Box>
      <Box>
        <Table>
          <TableCaption placement="top">
            <Heading as="h2">Items</Heading>
          </TableCaption>
          <Thead>
            <Tr>
              <Th>Product Info</Th>
              <Th isNumeric>Quantity</Th>
              <Th isNumeric>Price</Th>
            </Tr>
          </Thead>
          {/* @ts-ignore */}
          {order.orderItems.map((item: any) => (
            <Tr key={item.id}>
              <Td>
                <Flex
                  flexDir={["column", "column", "row"]}
                  // justify="space-between"
                  align={{ base: "stretch" }}
                >
                  <Image
                    mr="2"
                    objectFit="cover"
                    w={["100%", "250px"]}
                    h="150px"
                    alt={item.menu.name}
                    src={item.menu.image}
                  />
                  <Box>
                    <Text fontWeight="bold" fontSize="xl">
                      {item.menu.name}
                    </Text>
                    <Text>{item.menu.price}</Text>
                  </Box>
                </Flex>
              </Td>
              <Td isNumeric>{item.qty}</Td>
              <Td isNumeric>₦{item.total_price}</Td>
            </Tr>
          ))}
        </Table>
      </Box>
    </Box>
  );
};

export default Order;

export const getServerSideProps: GetServerSideProps = withPageAuth({
  redirectTo: "/login",
  getServerSideProps: async (ctx) => {
    const id = ctx.query.id;
    const queryClient = new QueryClient();

    const fetchOrder = async () => {
      const { data } = await supabase
        .from("order")
        .select(
          `
        *, user:users(username), orderItems(*, menu(*))
      `
        )
        .eq("id", id as string)
        .single();

      return data;
    };

    await queryClient.prefetchQuery(["order", ctx.query.id], fetchOrder);

    return {
      props: {
        dehydratedState: dehydrate(queryClient),
      },
    };
  },
});
