import { Box, Heading, Text, Button, Flex } from "@chakra-ui/react";
import CartItem from "./CartItem";
import { useCart } from "@context/CartContext";
import { useState } from "react";
import { useOrder } from "@context/OrderContext";
import { useAuth } from "@context/AuthContext";
import { usePaystackPayment } from "react-paystack";

const Cart = ({ cafe }) => {
  const { user } = useAuth();
  const { clearCart, cart } = useCart();
  const { createOrder } = useOrder();
  const [isProcessing, setIsProcessing] = useState(false);

  const config = {
    email: user?.email,
    amount: cart?.totalAmount * 100,
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_KEY,
  };

  const onSuccess = async (res) => {
    await createOrder(cart.totalAmount, res.reference, cafe.id);
    setIsProcessing(false);
  };
  const onClosePayment = () => setIsProcessing(false);
  const initializePayment = usePaystackPayment(config);
  const initiatePayment = () => {
    initializePayment(onSuccess, onClosePayment);
    setIsProcessing(true);
  };
  return (
    <Box
      position="sticky"
      top="5"
      borderWidth="1px"
      borderColor="red.900"
      h="70vh"
      mt="5"
      overflow="auto"
      boxShadow="md"
    >
      <Text size="lg">Order from {cafe.name}</Text>
      <Box>
        {!cart?.cartDetails?.length ? (
          <Text>You have no item in your cart</Text>
        ) : (
          cart?.cartDetails.map((item) => (
            <CartItem item={item} key={item.id} />
          ))
        )}
      </Box>
      <Flex justify="space-between" align="center" w="100%">
        <Text>Total: N{cart?.totalAmount}</Text>
        <Box>
          <Button
            disabled={!cart?.cartDetails.length || isProcessing}
            variant="outline"
            mr={3}
            onClick={() => clearCart()}
          >
            Clear
          </Button>
          <Button
            colorScheme="blue"
            onClick={initiatePayment}
            disabled={!cart?.cartDetails.length || isProcessing}
            isLoading={isProcessing}
            loadingText="Processing"
          >
            Checkout
          </Button>
        </Box>
      </Flex>
    </Box>
  );
};

export default Cart;
