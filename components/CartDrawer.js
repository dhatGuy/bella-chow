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
  Icon,
  StackDivider,
  VStack,
} from "@chakra-ui/react";
import Cart from "@components/Cart";
import { useCart } from "@context/CartContext";
import { usePaystackPayment } from "react-paystack";
import { useAuth } from "@context/AuthContext";
import { useOrder } from "@context/OrderContext";
import { useState } from "react";
import CartItem from "@components/CartItem";

function CartDrawer({ isOpen, onClose, cafe }) {
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
          <DrawerHeader borderBottomWidth="1px">
            Order from {cafe.name}
          </DrawerHeader>
          <DrawerBody>
            {/* <Box>
              {!cart?.cartDetails?.length ? (
                <Text>You have no item in your cart</Text>
              ) : (
                cart?.cartDetails.map((item) => (
                  <CartItem item={item} key={item.id} />
                ))
              )}
            </Box> */}
            <VStack
              direction="column"
              overflow="auto"
              spacing="2"
              align="stretch"
              divider={<StackDivider borderColor="gray.200" />}
            >
              {!cart?.cartDetails?.length ? (
                <>
                  <Icon as={FiShoppingCart} w={20} h={20} />
                  <Text>You have no item in your cart</Text>
                </>
              ) : (
                cart?.cartDetails.map((item) => (
                  <CartItem item={item} key={item.id} />
                ))
              )}
            </VStack>
          </DrawerBody>
          <DrawerFooter borderTopWidth="1px">
            <Flex justify="space-between" align="center" w="100%">
              <Text>Total:N {cart?.totalAmount.toFixed(2)}</Text>
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
