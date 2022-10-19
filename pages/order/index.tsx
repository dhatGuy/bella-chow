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
import Router from "next/router";
import Moment from "react-moment";
import WithAuth from "~components/WithAuth";
import useGetOrders from "~hooks/order/useGetOrders";

const Order = () => {
  const { data: order } = useGetOrders();

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
                    <Td>
                      <Moment format="ddd LL">{order.date}</Moment>
                    </Td>
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

export default WithAuth(Order);
