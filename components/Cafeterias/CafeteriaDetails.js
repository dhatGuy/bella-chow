import { AddIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Circle,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  Icon,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import Cart from "@components/Cart";
import CartDrawer from "@components/CartDrawer";
import MenuList from "@components/MenuList";
import Rating from "@components/Rating";
import ReviewModal from "@components/Reviews/ReviewModal";
import { useAuth } from "@context/AuthContext";
import { useCart } from "@context/CartContext";
import { supabase } from "api";
import { useEffect } from "react";
import { IoCartOutline } from "react-icons/io5";

const CafeteriaDetails = ({ cafe }) => {
  const { user } = useAuth();
  const { setCart } = useCart();
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

  useEffect(() => {
    const getCart = async () => {
      if (user) {
        const { data, error } = await supabase
          .from("cart")
          .select(`*, cartDetails(*, menu(*))`)
          .eq("user_id", user?.id)
          .eq("cafe_id", cafe?.id)
          .single();

        if (data) {
          setCart(data);
        } else {
          const { data, error } = await supabase
            .from("cart")
            .insert([{ user_id: user?.id, cafe_id: cafe?.id }])
            .select(`*, cartDetails(*, menu(*))`)
            .eq("user_id", user?.id)
            .eq("cafe_id", cafe?.id)
            .single();
          setCart(data);
        }
      }
    };
    getCart();
  }, [cafe, setCart, user]);
  return (
    <Box position="relative">
      <CartDrawer
        isOpen={isOpenCart}
        onOpen={onOpenCart}
        onClose={onCloseCart}
        cafe={cafe}
      />
      <ReviewModal isOpen={isOpenReview} onClose={onCloseReview} />
      <Stack
        position="relative"
        bgColor="black"
        height={"36"}
        alignItems="center"
        bgImg={`${cafe.image}`}
        bgSize="cover"
        backgroundRepeat="no-repeat"
        bgRepeat="no-repeat"
        justify="center"
        bgPos={"center center"}
        _before={{
          content: '""',
          position: "absolute",
          top: "0px",
          right: "0px",
          bottom: "0px",
          left: "0px",
          backgroundColor: "rgba(0,0,0,0.25)",
        }}
      >
        <Heading
          as={"h1"}
          textColor="white"
          fontSize={{ base: "4xl", md: "7xl" }}
          zIndex={2}
        >
          {cafe.name}
        </Heading>
      </Stack>
      <Circle
        size="90px"
        bg="orange"
        position="fixed"
        display={{ base: "flex", md: "none" }}
        bottom={4}
        right={4}
        color={"white"}
        zIndex="3"
      >
        <Icon as={IoCartOutline} onClick={onOpenCart} w={10} h={10} />
      </Circle>
      <Box boxShadow="lg" mb="10" pl={2} pb={2}>
        <Heading>{cafe.name}</Heading>
        <HStack>
          <Rating rating={3.5} numReviews={30} />
          <Text
            cursor="pointer"
            fontWeight="bold"
            variant="unstyled"
            onClick={onOpenReview}
          >
            See Reviews
          </Text>
        </HStack>
      </Box>
      <Grid
        templateRows="1fr"
        templateColumns="repeat(3, 1fr)"
        gap={4}
        m={2}
        justifyContent="center"
      >
        <GridItem
          colSpan={[3, 3, 2]}
          display="flex"
          flexDirection="column"
          justifyContent="center"
        >
          <MenuList menus={cafe.menu} />
        </GridItem>
        <GridItem display={{ base: "none", md: "initial" }}>
          <Cart cafe={cafe} />
        </GridItem>
      </Grid>
    </Box>
  );
};

export default CafeteriaDetails;
