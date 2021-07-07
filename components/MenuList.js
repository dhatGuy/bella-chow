import MenuItem from "./MenuItem";
import { SimpleGrid } from "@chakra-ui/react";

const MenuList = ({ menus }) => {
  return (
    <SimpleGrid minChildWidth="250px" spacing="40px" justifyItems="center">
      {menus.map((menu) => (
        <MenuItem key={menu.id} menu={menu} />
      ))}
    </SimpleGrid>
  );
};

export default MenuList;
