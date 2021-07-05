import { Box, Heading, Text } from "@chakra-ui/react";
import CartItem from "./CartItem";
import { useCart } from "./context/CartContext";

const Cart = () => {
  const { cart } = useCart();
  return (
    <Box>
      <Heading as="h4" size="lg">
        Your cart items
      </Heading>
      {!cart.cartDetails.length ? (
        <Text>You have no item in your cart</Text>
      ) : null}
      {cart.cartDetails.map((item) => (
        <CartItem item={item} key={item.id} />
      ))}
    </Box>
  );
};

export default Cart;
