import {
  Avatar,
  AvatarGroup,
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
import useCafeOrders from "hooks/useCafeOrders";
import Moment from "react-moment";

const Main = () => {
  // const { user } = useUser();
  const { data, isLoading, error } = useCafeOrders();

  const totalBalance = data
    ?.reduce((total, order) => total + order.amount, 0)
    .toFixed(2);
  if (isLoading) {
    return <Text>Loading...</Text>;
  }
  return (
    <Flex
      // w={["100%", "100%", "60%", "60%", "55%"]}
      w="100%"
      p="3%"
      flexDir="column"
      overflow="auto"
      minH="100vh"
    >
      <Heading fontWeight="normal" mb={4} letterSpacing="tight">
        Welcome back,{" "}
        <Flex display="inline-flex" fontWeight="bold">
          Admin
        </Flex>
      </Heading>
      <Text color="gray" fontSize="sm">
        My Balance
      </Text>
      <Text fontWeight="bold" fontSize="2xl">
        ₦{totalBalance}
      </Text>
      <Flex justifyContent="space-between" mt={8}>
        <Flex align="flex-end">
          <Heading as="h2" size="lg" letterSpacing="tight">
            Recent orders
          </Heading>
          {/* <Text fontSize="small" color="gray" ml={4}>
            Apr 2021
          </Text> */}
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
              {data?.map((order) => (
                <Tr key={order.id}>
                  <Td>
                    <Flex align="center">
                      <Avatar size="sm" mr={2} name={order.username} />
                      <Flex flexDir="column">
                        <Heading size="sm" letterSpacing="tight">
                          {order.id}
                        </Heading>
                        <Text fontSize="sm" color="gray">
                          <Moment format="ddd LL">{order.date}</Moment>
                        </Text>
                      </Flex>
                    </Flex>
                  </Td>
                  <Td>{order.user.username}</Td>
                  <Td>
                    <AvatarGroup size="md" max={2}>
                      {/* TODO: change type */}
                      {order.menu?.map((menu: any) => (
                        <Avatar
                          key={menu.id}
                          name={menu.name}
                          src={menu.image}
                        />
                      ))}
                    </AvatarGroup>
                  </Td>
                  <Td isNumeric>
                    <Text fontWeight="bold" display="inline-table">
                      ₦{order.amount}
                    </Text>
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

export default Main;
