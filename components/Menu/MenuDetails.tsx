import { Box, Heading, Image, Text } from "@chakra-ui/react";
import { Menu } from "~types/types";

interface MenuDetailsProps {
  menu: Menu;
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
