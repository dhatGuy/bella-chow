import { Box, Heading, Image, Text } from "@chakra-ui/react";
import { Menus } from "~types";

interface MenuDetailsProps {
  menu: Menus;
}

const MenuDetails = ({ menu }: MenuDetailsProps) => {
  return (
    <Box>
      <Heading>{menu.name}</Heading>
      <Text>{menu.description}</Text>
      <Text>{menu.price}</Text>
      <Image src={menu.image} alt={menu.name} />
    </Box>
  );
};

export default MenuDetails;
