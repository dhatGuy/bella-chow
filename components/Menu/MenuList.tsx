import { SimpleGrid } from "@chakra-ui/react";
import { Menu } from "~types/types";
import MenuItem from "./MenuItem";

interface MenuListProps {
  menus: Menu[];
}

const MenuList = ({ menus }: MenuListProps) => {
  return (
    <SimpleGrid minChildWidth="250px" spacing="40px" justifyItems="center">
      {menus.map((menu) => (
        <MenuItem key={menu.id} menu={menu} />
      ))}
    </SimpleGrid>
  );
};

export default MenuList;
