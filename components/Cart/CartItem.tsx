import {
  Box,
  Button,
  Flex,
  HStack,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import { RiDeleteBin5Line } from "react-icons/ri";
import useRemoveFromCart from "~hooks/cart/useRemoveFromCart";
import useUpdateCartQty from "~hooks/cart/useUpdateCartQty";
import { CartItemWithMenu } from "~types/types";

interface CartItemProps {
  cartItem: CartItemWithMenu;
  cafeId: number;
}

const CartItem = ({ cartItem, cafeId }: CartItemProps) => {
  const removeFromCartMutation = useRemoveFromCart(cafeId);
  const updateCartQtyMutation = useUpdateCartQty(cafeId);

  return (
    <Flex>
      <VStack flex="1" align="stretch" justify="space-between">
        <Box>
          <Text fontWeight="semibold">{cartItem.menu.name}</Text>
          <p>Price: N{cartItem.menu.price.toFixed(2)}</p>
          <p>Total: N{cartItem.total_price.toFixed(2)}</p>
        </Box>
        <HStack>
          <Button
            size="sm"
            variant="solid"
            colorScheme="teal"
            disabled={cartItem.qty === 1}
            onClick={() =>
              updateCartQtyMutation.mutate({
                menuToUpdate: cartItem.menu,
                action: "-",
              })
            }
          >
            -
          </Button>
          <Text>{cartItem.qty}</Text>
          <Button
            size="sm"
            variant="solid"
            colorScheme="teal"
            onClick={() =>
              updateCartQtyMutation.mutate({
                menuToUpdate: cartItem.menu,
                action: "+",
              })
            }
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
          src={cartItem.menu.image}
          alt={cartItem.menu.name}
        />
        <Button
          size="sm"
          variant="solid"
          colorScheme="red"
          onClick={() => removeFromCartMutation.mutate(cartItem.id)}
        >
          <RiDeleteBin5Line />
        </Button>
      </Box>
    </Flex>
  );
};

export default CartItem;
