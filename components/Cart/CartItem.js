import {
  Box,
  Button,
  Text,
  Flex,
  Image,
  HStack,
  Heading,
  VStack,
} from "@chakra-ui/react";
import { useCart } from "@context/CartContext";
// import Image from "next/image";

const CartItem = ({ item }) => {
  const { increaseQty, decreaseQty } = useCart();
  return (
    <Flex>
      <VStack flex="1" align="stretch" justify="space-between">
        <Box>
          <Text fontWeight="semibold">{item.menu.name}</Text>
          <p>Price: N{item.menu.price.toFixed(2)}</p>
          <p>Total: N{item.total_price.toFixed(2)}</p>
        </Box>
        <HStack>
          <Button
            size="sm"
            variant="solid"
            colorScheme="teal"
            disabled={item.qty === 1}
            onClick={() => decreaseQty(item.menu)}
          >
            -
          </Button>
          <Text>{item.qty}</Text>
          <Button
            size="sm"
            variant="solid"
            colorScheme="teal"
            onClick={() => increaseQty(item.menu)}
          >
            +
          </Button>
        </HStack>
      </VStack>
      <Box flexBasis="50%">
        <Image
          w="full"
          h="130px"
          objectFit="cover"
          src={item.menu.image}
          alt={item.menu.name}
        />
      </Box>
    </Flex>
  );
};

export default CartItem;
