// @ts-nocheck
// TODO: remove ts-nocheck
import {
  Box,
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Table,
  TableCaption,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import router from "next/router";
import Moment from "react-moment";
import useCafeOrders from "~hooks/order/useCafeOrders";
import { supabase } from "~lib/api";

export const OrderStatus = ({ changeStatus }) => {
  return (
    <Menu isLazy>
      <MenuButton onClick={(e) => e.stopPropagation()} as={Button}>
        ...
      </MenuButton>
      <MenuList onClick={(e) => e.stopPropagation()}>
        <MenuItem onClick={() => changeStatus("processing")}>
          Accept order
        </MenuItem>
        <MenuItem onClick={(e) => changeStatus("delivered")}>
          Reject order
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

const OrderList = () => {
  const queryClient = useQueryClient();
  const { data: orders, isLoading } = useCafeOrders();
  const mutation = useMutation(
    async ({ id, status }) => {
      const { data, error } = await supabase
        .from("order")
        .update({ status })
        .match({ id });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("orders");
      },
    }
  );

  const changeStatus = async (id, status) => {
    mutation.mutate({ id, status });
  };

  if (isLoading || !orders) {
    return <Box>Loading...</Box>;
  }
  return (
    <Flex overflow="auto">
      <Table>
        <TableCaption placement="top">Order List</TableCaption>
        <Thead>
          <Tr>
            <Th>Order ID</Th>
            <Th>Amount</Th>
            <Th>Date</Th>
            <Th>Status</Th>
            <Th>Options</Th>
          </Tr>
        </Thead>
        <Tbody>
          {orders.map((order) => (
            <Tr
              key={order.id}
              onClick={(e) => {
                router.push(`orders/${order.id}`);
              }}
            >
              <Td>{order.id}</Td>
              <Td>{order.amount}</Td>
              <Td>
                <Moment format="ddd LL">{order.date}</Moment>
              </Td>
              <Td>{order.status}</Td>
              <Td cursor="pointer">
                <OrderStatus
                  changeStatus={(status) => changeStatus(order.id, status)}
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Flex>
  );
};

export default OrderList;
