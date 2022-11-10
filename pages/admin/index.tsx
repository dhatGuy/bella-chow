import {
  Avatar,
  AvatarGroup,
  Box,
  Divider,
  Flex,
  Heading,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import AdminLayout from "~components/AdminLayout";
import Spinner from "~components/Spinner";
import useProfile from "~hooks/auth/useProfile";
import useCafeOrders from "~hooks/order/useCafeOrders";

const Dashboard = () => {
  const { data: user, isLoading: userLoading } = useProfile();
  const { data: orders, isLoading, error } = useCafeOrders();

  // income for the current month
  const totalBalance = orders?.reduce((acc, order) => {
    return acc + order.amount;
  }, 0);

  if (isLoading || userLoading) return <Spinner />;

  return (
    <Flex
      // w={["100%", "100%", "60%", "60%", "55%"]}
      w="100%"
      p="3%"
      flexDir="column"
      overflow="auto"
    >
      <Box>{user?.cafeteria.name}</Box>
      <Box color="gray" fontSize="sm">
        Income for the month of{" "}
        <Flex display="inline-flex" fontWeight="bold">
          <Text color="gray" fontSize="sm">
            {dayjs().format("MMMM")}
          </Text>
        </Flex>
      </Box>
      <Text fontWeight="bold" fontSize="2xl">
        ₦{totalBalance}
      </Text>
      <Flex justifyContent="space-between" mt={8}>
        <Flex align="flex-end">
          <Heading as="h2" size="lg" letterSpacing="tight">
            Recent orders
          </Heading>
          <Text fontSize="small" color="gray" ml={4}>
            {dayjs().format("MMM YYYY")}
          </Text>
        </Flex>
      </Flex>
      <Flex flexDir="column">
        <Flex overflow="auto">
          <Table variant="unstyled" mt={4}>
            <Thead>
              <Tr color="gray">
                <Th>Order ID</Th>
                <Th>Customer</Th>
                <Th>Menus</Th>
                <Th isNumeric>Total Price</Th>
              </Tr>
            </Thead>
            <Tbody>
              {orders?.map((order) => (
                <Tr key={order.id}>
                  <Td>
                    <Flex align="center">
                      <Avatar
                        size="sm"
                        mr={2}
                        name={`${order.user?.firstname}`}
                      />
                      <Flex flexDir="column">
                        <Heading size="sm" letterSpacing="tight">
                          #{order.id}
                        </Heading>
                        <Text fontSize="sm" color="gray">
                          {dayjs(order.date).format("D MMM YYYY, h:mm A")}
                        </Text>
                      </Flex>
                    </Flex>
                  </Td>
                  <Td>{`${order.user?.firstname} ${order.user?.lastname}`}</Td>
                  <Td>
                    <AvatarGroup size="md" max={2}>
                      {order.items.map((item) =>
                        // check item menu has been deleted
                        item.menu ? (
                          <Avatar
                            key={item.menu.id}
                            name={item.menu.name}
                            src={item.menu.image}
                          />
                        ) : null
                      )}
                    </AvatarGroup>
                  </Td>
                  <Td isNumeric fontWeight="bold" display="inline-table">
                    ₦{order.amount}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Flex>
        <Flex align="center">
          <Divider />
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Dashboard;

Dashboard.getLayout = (page: React.ReactElement) => (
  <AdminLayout>{page}</AdminLayout>
);
