import {
  Box,
  Button,
  Flex,
  Grid,
  Icon,
  StackDivider,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { FiShoppingCart } from "react-icons/fi";
import { usePaystackPayment } from "react-paystack";
import { PaystackProps } from "react-paystack/dist/types";
import { useOrder } from "~context/OrderContext";
import useUser from "~hooks/auth/useUser";
import useClearCart from "~hooks/cart/useClearCart";
import useGetCart from "~hooks/cart/useGetCart";
import { Cafeteria } from "~types/types";
import CartItem from "./CartItem";

interface CartProps {
  cafe: Cafeteria;
}

const Cart = ({ cafe }: CartProps) => {
  const { data: user } = useUser();
  const clearCartMutation = useClearCart();
  const { createOrder } = useOrder();
  const [isProcessing, setIsProcessing] = useState(false);
  const { data: cart } = useGetCart(cafe.id);

  const config: PaystackProps = {
    // TODO: add email key to user
    email: user?.email,
    amount: (cart?.totalAmount * 100).toFixed(2),
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
          {!cart?.cartItems?.length ? (
            <VStack align="center" h="100%" justify="center">
              <Icon as={FiShoppingCart} w={20} h={20} />
              <Text>You have no item in your cart</Text>
            </VStack>
          ) : (
            cart?.cartItems.map((item) => (
              <CartItem cartItem={item} cafeId={cafe.id} key={item.id} />
            ))
          )}
        </VStack>
        <Flex justify="space-between" align="center" w="100%">
          <Text fontWeight="bold">Total: ₦{cart?.totalAmount || 0}</Text>
          <Box mt="4">
            <Button
              disabled={!cart?.cartItems.length || isProcessing}
              variant="outline"
              mr={3}
              onClick={() => clearCartMutation.mutateAsync(cart!.id)}
            >
              Clear
            </Button>
            <Button
              colorScheme="blue"
              onClick={initiatePayment}
              disabled={!cart?.cartItems.length || isProcessing}
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
