import {
  Box,
  Button,
  chakra,
  Divider,
  Grid,
  HStack,
  Icon,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { FiShoppingCart } from "react-icons/fi";
import useClearCart from "~hooks/cart/useClearCart";
import useGetCart from "~hooks/cart/useGetCart";
import { Cafeterias, CartItemWithMenu } from "~types";
import CartItem from "./CartItem";

interface CartProps {
  cafe: Cafeterias;
}

const Cart = ({ cafe }: CartProps) => {
  const clearCartMutation = useClearCart(cafe.id);
  const cart = useGetCart(cafe.id);
  const router = useRouter();
  // const [total, setTotal] = useState(0);

  // useEffect(() => {
  //   setTotal(
  //     cart.data?.cartItems.reduce(
  //       (acc: number, item: CartItemWithMenu) => acc + item.total_price,
  //       0
  //     )
  //   );
  // }, [cart]);

  return (
    <Box
      position="sticky"
      top={"0"}
      h="100vh"
      display={{ base: "none", lg: "initial" }}
      flexBasis={{ base: "100%", lg: "30%" }}
    >
      <Grid
        templateRows="auto 30em auto"
        position="relative"
        overflow="auto"
        boxShadow="md"
        py="4"
        px="6"
      >
        <VStack align={"flex-start"} py={2}>
          <Text fontSize={"xs"} fontWeight="medium">
            ORDER FROM <br />
            <chakra.span fontSize={"md"}>{cafe.name}</chakra.span>
          </Text>
          <Divider />
        </VStack>

        <VStack
          direction="column"
          overflow="auto"
          spacing="2"
          align="stretch"
          h="100%"
        >
          {!cart.data?.cartItems?.length ? (
            <VStack align="center" h="full" justify="center">
              <Icon as={FiShoppingCart} w={20} h={20} />
              <Text>You have no item in your cart</Text>
            </VStack>
          ) : (
            cart.data?.cartItems.map((item: CartItemWithMenu) => (
              <CartItem cartItem={item} cafeId={cafe.id} key={item.id} />
            ))
          )}
        </VStack>
        <VStack justify="space-between" align="center">
          <HStack w="full" justify={"space-between"}>
            <Text fontWeight="bold">Total</Text>
            <Text>₦{cart.data?.totalAmount.toFixed(2) || 0.0}</Text>
          </HStack>
          <Divider />
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
              disabled={!cart.data?.cartItems.length}
              onClick={() => router.push(`${router.asPath}/checkout`)}
            >
              Continue to checkout
            </Button>
          </HStack>
        </VStack>
      </Grid>
    </Box>
  );
};

export default Cart;
