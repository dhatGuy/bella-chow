import {
  Box,
  Flex,
  Heading,
  Image,
  Table,
  TableCaption,
  Tag,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import Moment from "react-moment";
import Spinner from "~components/Spinner";
import WithAuth from "~components/WithAuth";
import useGetOrder from "~hooks/order/useGetOrder";
import { supabase } from "~lib/api";
import { OrderWithItemsAndMenu } from "~types/types";

const Order = ({ data }: { data: OrderWithItemsAndMenu }) => {
  const router = useRouter();
  const { data: order, isLoading } = useGetOrder(Number(router.query.id));

  if (isLoading) return <Spinner />;

  return (
    <Box>
      <Heading as="h1">Order Details</Heading>
      <Box boxShadow="md">
        <Text>Order id: #{order?.id}</Text>
        <Text>
          Placed on: <Moment format="ddd LL">{order?.date}</Moment>
        </Text>
        <Text>Amount: {order?.amount}</Text>
        <Text>Payment Ref: {order?.payment_ref}</Text>
        <Tag>{order?.status}</Tag>
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
          <Tbody>
            {order?.items.map((item) => (
              <Tr key={item.id}>
                <Td>
                  <Flex
                    flexDir={["column", "column", "row"]}
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
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
};

export default WithAuth(Order);

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const queryClient = new QueryClient();
  const id = ctx.query.id as string;

  const getOrder = async () => {
    const { data } = await supabase
      .from<OrderWithItemsAndMenu>("order")
      .select(
        `
        *, items:order_item(*, menu(*))
      `
      )
      .eq("id", id)
      .single();

    return data;
  };

  await queryClient.prefetchQuery(["order", +id], getOrder);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};
