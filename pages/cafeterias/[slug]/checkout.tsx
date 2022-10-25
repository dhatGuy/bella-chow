import {
  Box,
  Button,
  chakra,
  FormControl,
  Grid,
  GridItem,
  Heading,
  HStack,
  Input,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import { withPageAuth } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/router";
import { useState } from "react";
import { usePaystackPayment } from "react-paystack";
import { PaystackProps } from "react-paystack/dist/types";
import useProfile from "~hooks/auth/useProfile";
import useGetCart from "~hooks/cart/useGetCart";
import useCreateOrder from "~hooks/order/useCreateOrder";
import { Cafeteria } from "~types";

function Checkout({ cafe }: { cafe: Cafeteria }) {
  const user = useProfile();
  const [isProcessing, setIsProcessing] = useState(false);
  const createOrderMutation = useCreateOrder(cafe.id);
  const { data: cart } = useGetCart(cafe.id);
  const router = useRouter();

  const config: PaystackProps = {
    email: user.data!.email,
    amount: Number((cart!.totalAmount * 100).toFixed(2)),
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_KEY as string,
  };
  const initializePayment = usePaystackPayment(config);

  const onSuccess = (res: { reference: any }) => {
    createOrderMutation.mutate(
      {
        amount: cart!.totalAmount,
        paymentRef: res.reference,
        userId: user.data!.id,
      },
      {
        onSuccess: () => {
          router.push(`/cafeterias/${cafe.slug}`);
        },
        onSettled: () => {
          setIsProcessing(false);
        },
      }
    );
  };

  const onClosePayment = () => setIsProcessing(false);
  const initiatePayment = () => {
    // @ts-ignore
    initializePayment(onSuccess, onClosePayment);
    setIsProcessing(true);
  };

  return (
    <Grid
      templateColumns={{
        base: "repeat(9, 1fr)",
        lg: "repeat(12, 1fr)",
      }}
      maxW="container.xl"
      mx="auto"
    >
      <GridItem
        colSpan={{
          base: 9,
          lg: 8,
          xl: 9,
        }}
        bgColor="white"
        h={{
          base: "auto",
          // lg: "90vh",
        }}
        pos="relative"
        p={6}
      >
        <HStack>
          <chakra.svg
            display="inline"
            width="2"
            height="4"
            viewBox="0 0 6 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5 1L1 5L5 9"
              stroke="#4B5563"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </chakra.svg>
          <chakra.span cursor="pointer" color="gray.500" fontWeight="normal">
            Back
          </chakra.span>
        </HStack>
        <Heading
          as="h3"
          fontWeight="semibold"
          color="gray.800"
          fontSize="4xl"
          mt="2"
        >
          Checkout
        </Heading>

        <Box mt={7}>
          <Text fontSize="small" color="gray.600" mb={3}>
            Your details
          </Text>
          <Heading as="h3" fontSize="2xl" color="gray.600" fontWeight="medium">
            Enter your details
          </Heading>

          <chakra.form mt={8} autoComplete="off">
            <SimpleGrid
              gridTemplateColumns={{
                base: "repeat(1, 1fr)",
                lg: "repeat(2, 1fr)",
              }}
              columnGap="10"
              rowGap={"12"}
            >
              <FormControl>
                <Input
                  type="email"
                  variant="flushed"
                  placeholder="Email address"
                  defaultValue={user.data?.email}
                  isDisabled
                />
              </FormControl>
              <FormControl>
                <Input
                  variant="flushed"
                  type="text"
                  placeholder="Your name"
                  defaultValue={user.data?.firstname}
                />
              </FormControl>
              <FormControl>
                <Input
                  type="text"
                  variant="flushed"
                  placeholder="Phone Number"
                  defaultValue={user.data?.phone}
                />
              </FormControl>
            </SimpleGrid>
          </chakra.form>
        </Box>

        <Button
          w={{
            base: "full",
            md: "auto",
          }}
          mt="10"
          p="4"
          bgColor="gray.800"
          _hover={{
            bgColor: "gray.900",
          }}
          py="8"
          color="white"
          onClick={initiatePayment}
          isLoading={isProcessing || createOrderMutation.isLoading}
          disabled={!cart?.cartItems.length}
        >
          Pay with Paystack
        </Button>
      </GridItem>
      <GridItem
        colSpan={{
          base: 9,
          lg: 4,
          xl: 3,
        }}
        bgColor={"gray.100"}
        h={{
          base: "auto",
          lg: "auto",
          xl: "100vh",
        }}
        px={{
          base: 8,
          xl: 12,
        }}
        py={{
          base: 14,
          xl: 20,
        }}
        pos="relative"
      >
        <HStack flex={1} justify="space-between">
          <Heading color="gray.800" fontWeight={"semibold"} fontSize="2xl">
            Items
          </Heading>
          <Heading
            color="gray.600"
            _hover={{
              color: "gray.800",
            }}
            as="h3"
            cursor="pointer"
            fontWeight={"normal"}
            fontSize="inherit"
            textDecor="underline"
          >
            Edit Cart
          </Heading>
        </HStack>

        {cart?.cartItems.map((item) => (
          <HStack
            mt={7}
            flex={1}
            color="gray.800"
            fontSize="lg"
            fontWeight="normal"
            key={item.id}
          >
            <Text>{item.menu.name}</Text>
            <Text
              as="h3"
              flex="auto"
              textAlign="right"
              pr={{
                base: 4,
                md: 5,
                lg: 4,
              }}
            >
              {item.qty}x
            </Text>
            <Text as="h3">N{item.menu.price}</Text>
          </HStack>
        ))}

        <HStack
          justify="space-between"
          bottom={
            {
              // base: "-28px",
              // md: "40px",
              // lg: 0,
            }
          }
          px={{
            base: 8,
            xl: 12,
          }}
          pb={{
            base: 5,
            md: 10,
            lg: 10,
          }}
          pt={{
            md: 80,
            lg: 0,
          }}
          pos="absolute"
          left={0}
          w="full"
          fontSize={"large"}
          fontWeight="medium"
          color={"gray.800"}
          bgColor="gray.100"
        >
          <chakra.span
            aria-label="Total"
            fontSize="2xl"
            color="gray.800"
            fontWeight="normal"
          >
            Total
          </chakra.span>
          <chakra.span
            fontSize="2xl"
            color="gray.800"
            fontWeight={"semibold"}
            aria-label="Total Price"
          >
            N{cart?.totalAmount}
          </chakra.span>
        </HStack>
      </GridItem>
    </Grid>
  );
}

export default Checkout;

export const getServerSideProps = withPageAuth({
  redirectTo: "/login",
  async getServerSideProps(ctx, supabase) {
    const slug = ctx.params!.slug;

    const { data, error } = await supabase
      .from("cafeteria")
      .select()
      .eq("slug", slug as string)
      .single();

    return {
      props: {
        cafe: data,
      },
    };
  },
});
