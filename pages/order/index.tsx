import {
  Box,
  Table,
  TableCaption,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { withPageAuth } from "@supabase/auth-helpers-nextjs";
import dayjs from "dayjs";
import Router from "next/router";
import Spinner from "~components/Spinner";
import useGetOrders from "~hooks/order/useGetOrders";

const Order = () => {
  const { data: order, isLoading } = useGetOrders();

  if (isLoading) return <Spinner />;

  return (
    <Box overflow="auto">
      <>
        <Table>
          <TableCaption placement="top">Order History</TableCaption>
          <Thead>
            <Tr>
              <Th>Reference</Th>
              <Th>Created At</Th>
              <Th>Status</Th>
              <Th>Total Amount</Th>
            </Tr>
          </Thead>
          <Tbody>
            {order?.length ? (
              order?.map((order) => {
                return (
                  <Tr
                    onClick={() => Router.push(`order/${order.id}`)}
                    key={order.id}
                  >
                    <Td>{order.payment_ref}</Td>
                    <Td>{dayjs(order.date).format("D MMM YYYY, h:mm A")}</Td>
                    <Td>{order.status}</Td>
                    <Td>₦{order.amount}</Td>
                  </Tr>
                );
              })
            ) : (
              <Tr>
                <Td colSpan={4}>No order yet</Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </>
    </Box>
  );
};

export default Order;

export const getServerSideProps = withPageAuth({
  redirectTo: "/login",
});
