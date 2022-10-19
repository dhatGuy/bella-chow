// @ts-nocheck
// TODO: remove ts-nocheck

import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
} from "@chakra-ui/react";
import {
  FiBell,
  FiCreditCard,
  FiDollarSign,
  FiPlus,
  FiSearch,
} from "react-icons/fi";

const Rightbar = ({ value, changeValue }) => {
  return (
    <Flex
      w={["100%", "100%", "30%"]}
      bgColor="#F5F5F5"
      p="3%"
      flexDir="column"
      overflow="auto"
      minW={[null, null, "300px", "300px", "400px"]}
    >
      <Flex alignContent="center">
        <InputGroup
          bgColor="#fff"
          mb={4}
          border="none"
          borderColor="#fff"
          borderRadius="10px"
          mr={2}
        >
          <InputLeftElement pointerEvents="none">
            <FiSearch color="gray" />
          </InputLeftElement>
          <Input type="number" placeholder="Search" borderRadius="10px" />
        </InputGroup>
        <IconButton
          icon={<FiBell />}
          fontSize="sm"
          bgColor="#fff"
          borderRadius="50%"
          p="10px"
          aria-label={""}
        />
        <Flex
          w={30}
          h={25}
          bgColor="#B57295"
          borderRadius="50%"
          color="#fff"
          align="center"
          justify="center"
          ml="-3"
          mt="-2"
          zIndex="100"
          fontSize="xs"
        >
          2
        </Flex>
      </Flex>
      <Heading letterSpacing="tight">My Cards</Heading>
      {value == 1 && (
        <Box
          borderRadius="25px"
          mt={4}
          w="100%"
          h="200px"
          bgGradient="linear(to-t, #B57295, #29259A)"
        >
          <Flex
            p="1em"
            color="#fff"
            flexDir="column"
            h="100%"
            justify="space-between"
          >
            <Flex justify="space-between" w="100%" align="flex-start">
              <Flex flexDir="column">
                <Text color="gray.400">Current Balance</Text>
                <Text fontWeight="bold" fontSize="xl">
                  $5,750.20
                </Text>
              </Flex>
              <Flex align="center">
                <Icon mr={2} as={FiCreditCard} />
                <Text>Rise.</Text>
              </Flex>
            </Flex>
            <Text mb={4}>**** **** **** 1289</Text>
            <Flex align="flex-end" justify="space-between">
              <Flex>
                <Flex flexDir="column" mr={4}>
                  <Text textTransform="uppercase" fontSize="xs">
                    Valid Thru
                  </Text>
                  <Text fontSize="lg">12/23</Text>
                </Flex>
                <Flex flexDir="column">
                  <Text textTransform="uppercase" fontSize="xs">
                    CVV
                  </Text>
                  <Text fontSize="lg">***</Text>
                </Flex>
              </Flex>
              <Icon as={FiCreditCard} />
            </Flex>
          </Flex>
        </Box>
      )}
      {value == 2 && (
        <Box
          borderRadius="25px"
          mt={4}
          w="100%"
          h="200px"
          bgGradient="linear(to-t, yellow.300, blue.500)"
        >
          <Flex
            p="1em"
            color="#fff"
            flexDir="column"
            h="100%"
            justify="space-between"
          >
            <Flex justify="space-between" w="100%" align="flex-start">
              <Flex flexDir="column">
                <Text color="gray.400">Current Balance</Text>
                <Text fontWeight="bold" fontSize="xl">
                  $350.00
                </Text>
              </Flex>
              <Flex align="center">
                <Icon mr={2} as={FiCreditCard} />
                <Text>Rise.</Text>
              </Flex>
            </Flex>
            <Text mb={4}>**** **** **** 8956</Text>
            <Flex align="flex-end" justify="space-between">
              <Flex>
                <Flex flexDir="column" mr={4}>
                  <Text textTransform="uppercase" fontSize="xs">
                    Valid Thru
                  </Text>
                  <Text fontSize="lg">9/24</Text>
                </Flex>
                <Flex flexDir="column">
                  <Text textTransform="uppercase" fontSize="xs">
                    CVV
                  </Text>
                  <Text fontSize="lg">***</Text>
                </Flex>
              </Flex>
              <Icon as={FiCreditCard} />
            </Flex>
          </Flex>
        </Box>
      )}
      {value == 3 && (
        <Box
          borderRadius="25px"
          mt={4}
          w="100%"
          h="200px"
          bgGradient="linear(to-t, orange.300, pink.600)"
        >
          <Flex
            p="1em"
            color="#fff"
            flexDir="column"
            h="100%"
            justify="space-between"
          >
            <Flex justify="space-between" w="100%" align="flex-start">
              <Flex flexDir="column">
                <Text color="gray.400">Current Balance</Text>
                <Text fontWeight="bold" fontSize="xl">
                  $2,150.72
                </Text>
              </Flex>
              <Flex align="center">
                <Icon mr={2} as={FiCreditCard} />
                <Text>Rise.</Text>
              </Flex>
            </Flex>
            <Text mb={4}>**** **** **** 8353</Text>
            <Flex align="flex-end" justify="space-between">
              <Flex>
                <Flex flexDir="column" mr={4}>
                  <Text textTransform="uppercase" fontSize="xs">
                    Valid Thru
                  </Text>
                  <Text fontSize="lg">11/22</Text>
                </Flex>
                <Flex flexDir="column">
                  <Text textTransform="uppercase" fontSize="xs">
                    CVV
                  </Text>
                  <Text fontSize="lg">***</Text>
                </Flex>
              </Flex>
              <Icon as={FiCreditCard} />
            </Flex>
          </Flex>
        </Box>
      )}
      <Flex justifyContent="center" mt={2}>
        <Button
          bgColor={value == 1 ? "gray.600" : "gray.400"}
          size="xs"
          mx={1}
          onClick={() => changeValue(1)}
        />
        <Button
          bgColor={value == 2 ? "gray.600" : "gray.400"}
          size="xs"
          mx={1}
          onClick={() => changeValue(2)}
        />
        <Button
          bgColor={value == 3 ? "gray.600" : "gray.400"}
          size="xs"
          mx={1}
          onClick={() => changeValue(3)}
        />
      </Flex>
      <Flex flexDir="column" my={4}>
        <Flex justify="space-between" mb={2}>
          <Text>Balance</Text>
          <Text fontWeight="bold">$140.42</Text>
        </Flex>
        <Flex justify="space-between">
          <Text>Credit Limit</Text>
          <Text fontWeight="bold">$150.00</Text>
        </Flex>
      </Flex>
      <Heading letterSpacing="tight" size="md" my={4}>
        Send money to
      </Heading>
      <Flex>
        <AvatarGroup size="md" max={3}>
          <Avatar src="avatar-2.jpg" />
          <Avatar src="avatar-3.jpg" />
          <Avatar src="avatar-4.jpg" />
          <Avatar src="avatar-4.jpg" />
          <Avatar src="avatar-4.jpg" />
        </AvatarGroup>
        <Avatar icon={<FiPlus />} ml={2} color="#fff" bgColor="gray.300" />
      </Flex>
      <Text color="gray" mt={10} mb={2}>
        Card number
      </Text>
      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <FiCreditCard color="gray.700" />
        </InputLeftElement>
        <Input type="number" placeholder="xxxx xxxx xxxx xxxx" />
      </InputGroup>
      <Text color="gray" mt={4} mb={2}>
        Sum
      </Text>
      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <FiDollarSign color="gray.700" />
        </InputLeftElement>
        <Input type="number" placeholder="130.00" />
      </InputGroup>
      <Button
        mt={4}
        bgColor="blackAlpha.900"
        color="#fff"
        p={7}
        borderRadius={15}
      >
        Send money
      </Button>
    </Flex>
  );
};

export default Rightbar;
