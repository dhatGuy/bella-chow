import {
  Box,
  Heading,
  Text,
  Button,
  Flex,
  Grid,
  Icon,
  VStack,
  StackDivider,
} from "@chakra-ui/react";
import CartItem from "./CartItem";
import { useCart } from "@context/CartContext";
import { useState } from "react";
import { useOrder } from "@context/OrderContext";
import { useAuth } from "@context/AuthContext";
import { usePaystackPayment } from "react-paystack";
import { FiShoppingCart } from "react-icons/fi";

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
    <Box position="sticky" top="5" h="70vh" mt="5">
      <Grid
        templateRows="auto 30rem auto"
        position="relative"
        overflow="auto"
        boxShadow="lg"
        p="2"
      >
        <Text
          size="lg"
          fontSize={"4xl"}
          mb="2"
          borderBottom="2px"
          borderBottomColor="gray.300"
        >
          Order from {cafe.name}
        </Text>

        <VStack
          direction="column"
          overflow="auto"
          spacing="2"
          align="stretch"
          h="100%"
          divider={<StackDivider borderColor="gray.200" />}
        >
          {!cart?.cartDetails?.length ? (
            <VStack align="center" h="100%" justify="center">
              <Icon as={FiShoppingCart} w={20} h={20} />
              <Text>You have no item in your cart</Text>
            </VStack>
          ) : (
            cart?.cartDetails.map((item) => (
              <CartItem item={item} key={item.id} />
            ))
          )}
        </VStack>
        <Flex justify="space-between" align="center" w="100%">
          <Text fontWeight="bold">Total: ₦{cart?.totalAmount || 0}</Text>
          <Box mt="4">
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
      </Grid>
    </Box>
  );
};

export default Cart;
