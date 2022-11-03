import {
  Badge,
  Box,
  Button,
  Image,
  Menu,
  MenuButton,
  MenuItem as MenuChild,
  MenuList,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useDeleteMenu } from "~hooks/menu";
import { Menus } from "~types";

interface MenuItemProps {
  menu: Menus;
}

const MenuItem = ({ menu }: MenuItemProps) => {
  const { image, description, name, price, available, id } = menu;
  const router = useRouter();
  const deleteMenu = useDeleteMenu();

  const onDelete = async () => {
    deleteMenu.mutate({
      id,
      image,
    });
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
          <Menu>
            <MenuButton as={Button}>...</MenuButton>
            <MenuList>
              <MenuChild
                onClick={() => router.push(`/admin/menus/${menu.id}/edit`)}
              >
                Edit
              </MenuChild>
              <MenuChild onClick={() => onDelete()}>Delete</MenuChild>
            </MenuList>
          </Menu>
        </Box>
      </Stack>
    </Box>
  );
};

export default MenuItem;
