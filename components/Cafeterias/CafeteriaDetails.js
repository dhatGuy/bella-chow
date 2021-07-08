import {
  Heading,
  Image,
  Box,
  Flex,
  SimpleGrid,
  VStack,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import Cart from "@components/Cart";
import MenuList from "@components/MenuList";
import { useAuth } from "@context/AuthContext";
import { useCart } from "@context/CartContext";
import { supabase } from "api";
import { useEffect } from "react";
const CafeteriaDetails = ({ cafe }) => {
  const { user } = useAuth();
  const { cart, setCart } = useCart();
  useEffect(() => {
    const getC = async () => {
      if (user) {
        const { data, error } = await supabase
          .from("cart")
          .select(`*, cartDetails(*, menu(*))`)
          .eq("user_id", user?.id)
          .eq("cafe_id", cafe?.id)
          .single();
        setCart(data);
      }
    };
    getC();
  }, [cafe, setCart, user]);
  return (
    <Box>
      <Box position="relative">
        <h1>{cafe.name}</h1>
        <Image
          src={cafe.image}
          alt={cafe.name}
          loading="lazy"
          fit="fill"
          w="100%"
          h="200px"
        />
      </Box>
      <Grid templateRows="1fr" templateColumns="repeat(3, 1fr)" gap={4}>
        <GridItem colSpan={2}>
          <MenuList menus={cafe.menu} />
        </GridItem>
        <GridItem>
          <Cart cafe={cafe} />
        </GridItem>
      </Grid>
    </Box>
  );
};

export default CafeteriaDetails;
