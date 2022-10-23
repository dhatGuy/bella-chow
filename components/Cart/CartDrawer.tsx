// TODO: fix paystack type
// @ts-nocheck

import {
  Button,
  chakra,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  HStack,
  Icon,
  StackDivider,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { FiShoppingCart } from "react-icons/fi";
import CartItem from "~components/Cart/CartItem";
import useClearCart from "~hooks/cart/useClearCart";
import useGetCart from "~hooks/cart/useGetCart";
import { Cafeteria } from "~types";

interface CartDrawerProp {
  isOpen: boolean;
  onClose: () => void;
  cafe: Cafeteria;
}

function CartDrawer({ isOpen, onClose, cafe }: CartDrawerProp) {
  const clearCartMutation = useClearCart(cafe.id);
  const cart = useGetCart(cafe.id);
  const router = useRouter();

  // if (user.isLoading || cart.isLoading) return <Spinner />;

  // if (user.isError || cart.isError) {
  //   return <span>Error: {user.error?.message || cart.error?.message}</span>;
  // }

  return (
    <>
      <Drawer
        size={["sm"]}
        placement="bottom"
        onClose={onClose}
        isOpen={isOpen}
        isFullHeight
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">
            <VStack align={"flex-start"}>
              <Text>Review Cart</Text>
              <VStack align={"flex-start"}>
                <Text fontSize={"xs"} fontWeight="medium">
                  Order from <br />
                  <chakra.span fontSize={"md"}>{cafe.name}</chakra.span>
                </Text>
              </VStack>
            </VStack>
          </DrawerHeader>
          <DrawerBody>
            <VStack
              direction="column"
              overflow="auto"
              spacing="2"
              align="stretch"
              h="100%"
              divider={<StackDivider borderColor="gray.200" />}
            >
              {!cart.data?.cartItems?.length ? (
                <VStack align="center" h="100%" justify="center">
                  <Icon as={FiShoppingCart} w={20} h={20} />
                  <Text>You have no item in your cart</Text>
                </VStack>
              ) : (
                cart.data?.cartItems.map((item) => (
                  <CartItem cartItem={item} cafeId={cafe.id} key={item.id} />
                ))
              )}
            </VStack>
          </DrawerBody>
          <DrawerFooter borderTopWidth="1px">
            <VStack justify="space-between" align="center" w="100%">
              <HStack w="full" justify={"space-between"}>
                <Text fontWeight="bold">Total</Text>
                <Text>₦{cart.data?.totalAmount.toFixed(2)}</Text>
              </HStack>
              <HStack justify={"space-between"} w="full">
                <Button
                  disabled={!cart.data?.cartItems.length}
                  variant="outline"
                  mr={3}
                  onClick={() => clearCartMutation.mutate(cart.data!.id)}
                >
                  Clear
                </Button>
                <Button
                  colorScheme="blue"
                  onClick={() => router.push(`${router.asPath}/checkout`)}
                  disabled={!cart.data?.cartItems.length}
                >
                  Checkout
                </Button>
              </HStack>
            </VStack>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default CartDrawer;
