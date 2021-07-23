import {
  Avatar,
  Divider,
  Flex,
  Heading,
  IconButton,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { FiCalendar, FiChevronDown, FiChevronUp } from "react-icons/fi";

const Main = ({ display, changeDisplay }) => {
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
          Calvin
        </Flex>
      </Heading>
      <Text color="gray" fontSize="sm">
        My Balance
      </Text>
      <Text fontWeight="bold" fontSize="2xl">
        $5,750.20
      </Text>
      {/* <MyChart /> */}
      <Flex justifyContent="space-between" mt={8}>
        <Flex align="flex-end">
          <Heading as="h2" size="lg" letterSpacing="tight">
            Transactions
          </Heading>
          <Text fontSize="small" color="gray" ml={4}>
            Apr 2021
          </Text>
        </Flex>
        <IconButton icon={<FiCalendar />} />
      </Flex>
      <Flex flexDir="column">
        <Flex overflow="auto">
          <Table variant="unstyled" mt={4}>
            <Thead>
              <Tr color="gray">
                <Th>Name of transaction</Th>
                <Th>Category</Th>
                <Th isNumeric>Cashback</Th>
                <Th isNumeric>Amount</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td>
                  <Flex align="center">
                    <Avatar size="sm" mr={2} src="amazon.jpeg" />
                    <Flex flexDir="column">
                      <Heading size="sm" letterSpacing="tight">
                        Amazon
                      </Heading>
                      <Text fontSize="sm" color="gray">
                        Apr 24, 2021 at 1:40pm
                      </Text>
                    </Flex>
                  </Flex>
                </Td>
                <Td>Electronic Devices</Td>
                <Td isNumeric>+$2</Td>
                <Td isNumeric>
                  <Text fontWeight="bold" display="inline-table">
                    -$242
                  </Text>
                  .00
                </Td>
              </Tr>

              {display == "show" && (
                <>
                  <Tr>
                    <Td>
                      <Flex align="center">
                        <Avatar size="sm" mr={2} src="amazon.jpeg" />
                        <Flex flexDir="column">
                          <Heading size="sm" letterSpacing="tight">
                            Amazon
                          </Heading>
                          <Text fontSize="sm" color="gray">
                            Apr 12, 2021 at 9:40pm
                          </Text>
                        </Flex>
                      </Flex>
                    </Td>
                    <Td>Electronic Devices</Td>
                    <Td isNumeric>+$2</Td>
                    <Td isNumeric>
                      <Text fontWeight="bold" display="inline-table">
                        -$242
                      </Text>
                      .00
                    </Td>
                  </Tr>
                </>
              )}
            </Tbody>
          </Table>
        </Flex>
        <Flex align="center">
          <Divider />
          <IconButton
            icon={display == "show" ? <FiChevronUp /> : <FiChevronDown />}
            onClick={() => {
              if (display == "show") {
                changeDisplay("none");
              } else {
                changeDisplay("show");
              }
            }}
          />
          <Divider />
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Main;
