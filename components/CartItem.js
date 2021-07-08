import { Box, Button, Text, Flex, Image, HStack } from "@chakra-ui/react";
import { useCart } from "@context/CartContext";
// import Image from "next/image";

const CartItem = ({ item }) => {
  const { increaseQty, decreaseQty } = useCart();
  return (
    <Flex>
      <Box>
        <h3>{item.menu.name}</h3>
        <div>
          <p>Price: ${item.menu.price}</p>
          <p>Total: ${item.total_price}</p>
        </div>
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
      </Box>
      <Image src={item.menu.image} alt={item.menu.name} />
    </Flex>
  );
};

export default CartItem;
