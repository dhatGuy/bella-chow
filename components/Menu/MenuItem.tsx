import { AddIcon } from "@chakra-ui/icons";
import {
  Badge,
  Box,
  Button,
  Image,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import Router from "next/router";
import useUser from "~hooks/auth/useUser";
import useAddToCart from "~hooks/cart/useAddToCart";
import { Menu } from "~types/types";

interface MenuItemProps {
  menu: Menu;
}

const MenuItem = ({ menu }: MenuItemProps) => {
  const { image, description, name, price, available, id, cafe_id } = menu;
  const { data: user } = useUser();
  const addToCartMutation = useAddToCart(cafe_id as number);
  const toast = useToast();

  const showDetails = () => Router.push("/menus/" + id);

  const addToCart = async () => {
    addToCartMutation.mutate({ menu });
  };

  return (
    <Box maxW="sm" borderWidth="1px" borderRadius="lg" overflow="hidden">
      <Box w="full">
        <Image w="full" h="200px" objectFit="cover" src={image} alt={name} />
      </Box>

      <Stack display="flex" spacing={6} p={6} justify="space-between">
        <Box>
          <Badge
            borderRadius="full"
            px="2"
            colorScheme={available ? "teal" : "red"}
          >
            {available ? "available" : "not available"}
          </Badge>
          <Text mt="1" fontWeight="semibold" as="h4" lineHeight="tight">
            {name}
          </Text>
          <Text
            mt="1"
            fontWeight="normal"
            as="p"
            lineHeight="tight"
            noOfLines={[1, 2, 3]}
          >
            {description}
          </Text>
        </Box>
        <Box
          display="flex"
          mt="2"
          alignItems="center"
          justifyContent="space-between"
        >
          <Text>₦{price}</Text>
          <Button
            colorScheme="blue"
            onClick={addToCart}
            isLoading={addToCartMutation.isLoading}
            variant="outline"
            leftIcon={<AddIcon />}
            disabled={!available}
          >
            Add to cart
          </Button>
        </Box>
      </Stack>
    </Box>
  );
};

export default MenuItem;
