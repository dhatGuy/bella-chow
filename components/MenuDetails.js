import { Text, Box, Heading, Image } from "@chakra-ui/react";

const MenuDetails = ({ menu }) => {
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
