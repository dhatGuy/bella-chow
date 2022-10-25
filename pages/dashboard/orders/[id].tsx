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
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next/types";
import Moment from "react-moment";
import WithCafeAuth from "~components/WithCafeAuth";
import { supabase } from "~lib/api";
import { OrderWithItemsAndMenu } from "~types";

const Order = (data: OrderWithItemsAndMenu) => {
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
  const { data: order } = useQuery(["order"], fetchOrder, {
    initialData: data,
  });

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

          {order.items.map((item: any) => (
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

export default WithCafeAuth(Order);

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const id = ctx.query.id;
  const { data } = await supabase
    .from("order")
    .select(
      `
        *, user:users(username), orderItems(*, menu(*))
      `
    )
    .eq("id", id as string)
    .single();

  return {
    props: {
      data,
    },
  };
};
