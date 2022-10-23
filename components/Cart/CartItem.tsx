import { Button, HStack, IconButton, Text, VStack } from "@chakra-ui/react";
import { FaMinus, FaPlus } from "react-icons/fa";
import useRemoveFromCart from "~hooks/cart/useRemoveFromCart";
import useUpdateCartQty from "~hooks/cart/useUpdateCartQty";
import { CartItemWithMenu } from "~types";

interface CartItemProps {
  cartItem: CartItemWithMenu;
  cafeId: number;
}

const CartItem = ({ cartItem, cafeId }: CartItemProps) => {
  const removeFromCartMutation = useRemoveFromCart(cafeId);
  const updateCartQtyMutation = useUpdateCartQty(cafeId);

  return (
    // <Flex>
    <VStack>
      <HStack justify={"space-between"} w="full">
        <Text fontWeight="semibold">{cartItem.menu.name}</Text>
        <HStack>
          <IconButton
            size="xs"
            variant="solid"
            colorScheme="teal"
            isRound
            icon={<FaMinus />}
            aria-label="decrease quantity"
            disabled={cartItem.qty === 1}
            onClick={() =>
              updateCartQtyMutation.mutate({
                menuToUpdate: cartItem.menu,
                action: "-",
              })
            }
          >
            -
          </IconButton>
          <Text>{cartItem.qty}</Text>
          <IconButton
            size="xs"
            variant="solid"
            colorScheme="teal"
            icon={<FaPlus />}
            isRound
            aria-label="increase quantity"
            onClick={() =>
              updateCartQtyMutation.mutate({
                menuToUpdate: cartItem.menu,
                action: "+",
              })
            }
          >
            +
          </IconButton>
        </HStack>
      </HStack>
      <HStack justify={"space-between"} w="full">
        <Text>₦{cartItem.total_price.toFixed(2)}</Text>
        <Button
          variant={"unstyled"}
          onClick={() => removeFromCartMutation.mutate(cartItem.id)}
        >
          Remove
        </Button>
      </HStack>
    </VStack>
    // </Flex>
  );
};

export default CartItem;
