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
import { dehydrate, QueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next/types";
import { useGetOrder } from "~hooks/order";
import { supabase } from "~lib/api";
import { OrderWithItemsAndMenuAndUser } from "~types";

const Order = () => {
  const router = useRouter();

  const { data: order } = useGetOrder(Number(router.query.id));

  if (!order) {
    return null;
  }

  return (
    <Box>
      <Heading as="h1">Order Details</Heading>
      <Box boxShadow="md">
        <Text>Order id: #{order.id}</Text>
        <Text>Ordered by: {order.user.username}</Text>
        <Text>Placed on: {dayjs(order.date).format("d MMM YYYY, h:mm A")}</Text>
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
          {order.items.map((item) =>
            item.menu ? (
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
            ) : (
              // menu has been deleted
              <Tr key={item.id}>
                <Td>Menu has been deleted</Td>
                <Td isNumeric>{item.qty}</Td>
                <Td isNumeric>₦{item.total_price}</Td>
              </Tr>
            )
          )}
        </Table>
      </Box>
    </Box>
  );
};

export default Order;

export const getServerSideProps: GetServerSideProps = withPageAuth({
  redirectTo: "/login",
  getServerSideProps: async (ctx) => {
    const id = Number(ctx.query.id);
    const queryClient = new QueryClient();

    const fetchOrder = async () => {
      const { data } = await supabase
        .from("order")
        .select(
          `
        *, user(username), items:order_items(*, menu(*))
      `
        )
        .eq("id", id)
        .single();

      return data as OrderWithItemsAndMenuAndUser;
    };

    await queryClient.prefetchQuery(
      ["order", Number(ctx.query.id)],
      fetchOrder
    );

    return {
      props: {
        dehydratedState: dehydrate(queryClient),
      },
    };
  },
});
