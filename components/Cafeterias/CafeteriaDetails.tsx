import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Flex,
  Heading,
  HStack,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import Cart from "~components/Cart/Cart";
import CartDrawer from "~components/Cart/CartDrawer";
import MenuList from "~components/Menu/MenuList";
import Rating from "~components/Rating";
import ReviewModal from "~components/Reviews/ReviewModal";
import useUser from "~hooks/auth/useUser";
import useGetCart from "~hooks/cart/useGetCart";
import { CafeteriaWithMenuAndReviews } from "~types/types";

interface CafeteriaDetailsProps {
  cafe: CafeteriaWithMenuAndReviews;
}

const CafeteriaDetails = ({ cafe }: CafeteriaDetailsProps) => {
  const [avg_rating, setAvg_rating] = useState(0);
  const { data: user } = useUser();
  const {
    isOpen: isOpenCart,
    onOpen: onOpenCart,
    onClose: onCloseCart,
  } = useDisclosure();
  const {
    isOpen: isOpenReview,
    onOpen: onOpenReview,
    onClose: onCloseReview,
  } = useDisclosure();
  const { data: cart } = useGetCart(cafe.id);

  useEffect(() => {
    const total = cafe.reviews.reduce(
      (total, review) => total + review.rating,
      0
    );
    setAvg_rating(total / cafe.reviews.length);
  }, [cafe]);

  return (
    <>
      <CartDrawer isOpen={isOpenCart} onClose={onCloseCart} cafe={cafe} />
      <ReviewModal
        isOpen={isOpenReview}
        onClose={onCloseReview}
        cafeId={cafe.id}
      />
      <Flex>
        <Box flex="3">
          <Stack
            position="relative"
            bgColor="black"
            height={"36"}
            alignItems="center"
            bgImg={`${cafe.image}`}
            bgSize="cover"
            bgRepeat="no-repeat"
            justify="center"
            bgPos={"center center"}
            _before={{
              content: '""',
              position: "absolute",
              top: "0",
              right: "0",
              bottom: "0",
              left: "0",
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
          >
            <Heading
              textColor="white"
              letterSpacing="widest"
              fontSize={{ base: "4xl", md: "7xl" }}
              zIndex={2}
            >
              {cafe.name}
            </Heading>
          </Stack>
          <Box
            boxShadow="md"
            top={0}
            bgColor="white"
            zIndex={"docked"}
            pl={{
              base: 4,
              lg: 12,
            }}
            py={4}
            // pos="sticky"
          >
            <Breadcrumb separator=">">
              <BreadcrumbItem>
                <BreadcrumbLink as={Link} href="/">
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbItem>
                <BreadcrumbLink as={Link} href="/cafeterias">
                  Cafeterias
                </BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbItem isCurrentPage>
                <BreadcrumbLink fontWeight={"semibold"}>
                  {cafe.name}
                </BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb>
            <Heading>{cafe.name}</Heading>
            <HStack>
              <Rating rating={avg_rating} numReviews={cafe.reviews.length} />
              <Button
                fontWeight="bold"
                variant="unstyled"
                onClick={onOpenReview}
              >
                See Reviews
              </Button>
            </HStack>
          </Box>

          <MenuList menuCategories={cafe.menuCategories} />
        </Box>
        <Cart cafe={cafe} />
      </Flex>
      {cart?.cartItems.length ? (
        <HStack
          pos="sticky"
          bottom={0}
          justify="space-between"
          w="full"
          bgColor="orange.300"
          py={4}
          px={2}
          color="gray.700"
          display={{ base: "flex", lg: "none" }}
          onClick={onOpenCart}
        >
          <Text>
            {cart?.cartItems.length} item
            {cart?.cartItems.length > 1 ? "s" : ""}
          </Text>
          <Button variant={"unstyled"} fontWeight={"bold"}>
            View Cart
          </Button>
          <Text>₦{cart?.totalAmount.toFixed(2)}</Text>
        </HStack>
      ) : null}
    </>
  );
};

export default CafeteriaDetails;
