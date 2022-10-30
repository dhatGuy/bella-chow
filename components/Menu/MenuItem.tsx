import { Image, ListItem, Text, VStack } from "@chakra-ui/react";
import Router from "next/router";
import useAddToCart from "~hooks/cart/useAddToCart";
import { Menus } from "~types";

interface MenuItemProps {
  menu: Menus;
}

const MenuItem = ({ menu }: MenuItemProps) => {
  const { image, description, name, price, available, id, cafe_id } = menu;
  const addToCartMutation = useAddToCart(cafe_id as number);

  const showDetails = () => Router.push("/menus/" + id);

  const addToCart = async () => {
    // if (!available) return;
    addToCartMutation.mutate({ menu });
  };

  return (
    <ListItem
      border={"none"}
      borderBottom={"1px"}
      borderWidth="1px"
      pb={5}
      overflow="hidden"
      onClick={addToCart}
      display="flex"
      columnGap={4}
    >
      <Image
        boxSize={{ base: 16, lg: 24 }}
        objectFit="cover"
        src={image}
        alt={name}
      />
      <VStack align={"flex-start"} w="full">
        {/* <Badge rounded="full">
            {available ? "available" : "not available"}
          </Badge> */}
        <Text fontWeight={600}>{name}</Text>
        <Text color="gray.500">{description}</Text>
        <Text alignSelf={"flex-end"}>₦{price}</Text>
      </VStack>
    </ListItem>
  );
};

export default MenuItem;
