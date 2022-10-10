import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Box,
  TableCaption,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useAuth } from "@context/AuthContext";
import { useOrder, getOrder, setOrder } from "@context/OrderContext";
import { useEffect } from "react";
import Moment from "react-moment";
import WithAuth from "@components/WithAuth";

const Order = () => {
  const { orders, getOrders } = useOrder();
  const { user } = useAuth();
  const Router = useRouter();

  useEffect(() => {
    getOrders();
  }, [getOrders]);

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
            {orders ? (
              orders.map((order) => {
                return (
                  <Tr
                    onClick={() => Router.push(`orders/${order.id}`)}
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
              <p>No order yet</p>
            )}
          </Tbody>
        </Table>
      </>
    </Box>
  );
};

export default WithAuth(Order);
