import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Table,
  TableCaption,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useAuth } from "@context/AuthContext";
import { supabase } from "api";
import router from "next/router";
import Moment from "react-moment";
import { useMutation, useQuery, useQueryClient } from "react-query";

export const OrderStatus = ({ changeStatus }) => {
  return (
    <Menu>
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
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const fetchOrders = async () => {
    if (user) {
      const { data, error } = await supabase
        .from("order")
        .select()
        .filter("cafe_id", "eq", user?.cafe[0].id);
      if (error) {
        throw new Error(error);
      }
      return data;
    }
  };
  const { data: orders, isLoading } = useQuery(["orders", user], fetchOrders);
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
    <Box overflow="auto">
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
    </Box>
  );
};

export default OrderList;
