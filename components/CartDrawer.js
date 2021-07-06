import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Button,
  Box,
  Flex,
  Text,
} from "@chakra-ui/react";
import Cart from "./Cart";
import { useCart } from "./context/CartContext";
import { usePaystackPayment } from "react-paystack";
import { useAuth } from "./context/AuthContext";
import { useOrder } from "./context/OrderContext";
import { useState } from "react";

function CartDrawer({ isOpen, onClose }) {
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
    await createOrder(cart.totalAmount, res.reference);
    setIsProcessing(false);
  };
  const onClosePayment = () => setIsProcessing(false);
  const initializePayment = usePaystackPayment(config);
  const initiatePayment = () => {
    initializePayment(onSuccess, onClosePayment);
    setIsProcessing(true);
  };
  return (
    <>
      <Drawer
        size={["sm"]}
        placement={"right"}
        onClose={onClose}
        isOpen={isOpen}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">Cart</DrawerHeader>
          <DrawerBody>
            <Cart />
          </DrawerBody>
          <DrawerFooter borderTopWidth="1px">
            <Flex justify="space-between" align="center" w="100%">
              <Text>Total: {cart?.totalAmount}</Text>
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
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default CartDrawer;
