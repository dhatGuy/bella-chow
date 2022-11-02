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
import dayjs from "dayjs";
import router from "next/router";
import { useCafeOrders, useUpdateOrder } from "~hooks/order";

export const OrderStatus = ({ id }: { id: number }) => {
  const updateOrder = useUpdateOrder();

  const changeStatus = async (status: "pending" | "accepted" | "rejected") => {
    updateOrder.mutate({ id, status });
  };

  return (
    <Menu isLazy>
      <MenuButton onClick={(e) => e.stopPropagation()} as={Button}>
        ...
      </MenuButton>
      <MenuList onClick={(e) => e.stopPropagation()}>
        <MenuItem onClick={() => changeStatus("accepted")}>
          Accept order
        </MenuItem>
        <MenuItem onClick={() => changeStatus("rejected")}>
          Reject order
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

const Orders = () => {
  const { data: orders, isLoading } = useCafeOrders();

  if (isLoading) {
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
          {orders?.map((order) => (
            <Tr
              key={order.id}
              onClick={() => router.push(`orders/${order.id}`)}
            >
              <Td>{order.id}</Td>
              <Td>{order.amount}</Td>
              <Td>{dayjs(order.date).format("d MMM YYYY, h:mm A")}</Td>
              <Td>{order.status}</Td>
              <Td cursor="pointer">
                <OrderStatus id={order.id} />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Flex>
  );
};

export default Orders;
