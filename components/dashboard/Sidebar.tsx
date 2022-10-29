import { Avatar, Flex, Icon, Link, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import { FiBox, FiDollarSign, FiHome, FiPieChart } from "react-icons/fi";
import useProfile from "~hooks/auth/useProfile";

const Sidebar = () => {
  const { data: user } = useProfile();
  return (
    <Flex
      w={["100%", "100%", "10%", "15%", "15%"]}
      flexDir="column"
      alignItems="center"
      backgroundColor="#020202"
      color="#fff"
    >
      <Flex
        flexDir="column"
        h={[null, null, "100vh"]}
        justifyContent="space-between"
      >
        <Flex flexDir="column" as="nav" h="100%">
          {/* <Heading
            mt={50}
            mb={[25, 50, 100]}
            fontSize={["4xl", "4xl", "2xl", "3xl", "4xl"]}
            alignSelf="center"
            letterSpacing="tight"
          >
            Rise.
          </Heading> */}
          <Flex
            flexDir={["row", "row", "column", "column", "column"]}
            align={["center", "center", "center", "flex-start", "flex-start"]}
            wrap={["wrap", "wrap", "nowrap", "nowrap", "nowrap"]}
            justifyContent="space-evenly"
            h="100%"
          >
            <Flex className="sidebar-items" mr={[2, 6, 0, 0, 0]}>
              <NextLink href="/admin" passHref>
                <Link display={["none", "none", "flex", "flex", "flex"]}>
                  <Icon as={FiHome} fontSize="2xl" className="active-icon" />
                </Link>
              </NextLink>
              <NextLink href="/admin" passHref>
                <Link
                  _hover={{ textDecor: "none" }}
                  display={["flex", "flex", "none", "flex", "flex"]}
                >
                  <Text className="active">Dashboard</Text>
                </Link>
              </NextLink>
            </Flex>
            <Flex className="sidebar-items" mr={[2, 6, 0, 0, 0]}>
              <NextLink href="/admin/menus" passHref>
                <Link display={["none", "none", "flex", "flex", "flex"]}>
                  <Icon as={FiPieChart} fontSize="2xl" />
                </Link>
              </NextLink>
              <NextLink href="/admin/menus" passHref>
                <Link
                  _hover={{ textDecor: "none" }}
                  display={["flex", "flex", "none", "flex", "flex"]}
                >
                  <Text>Menus</Text>
                </Link>
              </NextLink>
            </Flex>
            <Flex className="sidebar-items" mr={[2, 6, 0, 0, 0]}>
              <NextLink href="/admin/reviews" passHref>
                <Link display={["none", "none", "flex", "flex", "flex"]}>
                  <Icon as={FiDollarSign} fontSize="2xl" />
                </Link>
              </NextLink>
              <NextLink href="/admin/reviews" passHref>
                <Link
                  _hover={{ textDecor: "none" }}
                  display={["flex", "flex", "none", "flex", "flex"]}
                >
                  <Text>Reviews</Text>
                </Link>
              </NextLink>
            </Flex>
            <Flex className="sidebar-items" mr={[2, 6, 0, 0, 0]}>
              <NextLink href="/admin/orders" passHref>
                <Link display={["none", "none", "flex", "flex", "flex"]}>
                  <Icon as={FiBox} fontSize="2xl" />
                </Link>
              </NextLink>
              <NextLink href="/admin/orders" passHref>
                <Link
                  _hover={{ textDecor: "none" }}
                  display={["flex", "flex", "none", "flex", "flex"]}
                >
                  <Text>Orders</Text>
                </Link>
              </NextLink>
            </Flex>
          </Flex>
        </Flex>
        <Flex flexDir="column" alignItems="center" mb={10} mt={5}>
          <Avatar my={2} src="" name={user?.username} />
          <Text textAlign="center">{user?.username}</Text>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Sidebar;
