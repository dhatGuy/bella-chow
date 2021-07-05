import {
  Box,
  Flex,
  Avatar,
  HStack,
  Link,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  AvatarBadge,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";
import NextLink from "next/link";

import CartDrawer from "./CartDrawer";
import { useCart } from "./context/CartContext";
import { useAuth } from "./context/AuthContext";

export default function Simple() {
  const { cart } = useCart();
  const { signOut } = useAuth();
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenCart,
    onOpen: onOpenCart,
    onClose: onCloseCart,
  } = useDisclosure();

  const handleLogout = async () => {
    await signOut();

    router.push("/login");
  };

  return (
    <>
      <Box bg={useColorModeValue("gray.100", "gray.900")} px={4}>
        <CartDrawer
          isOpen={isOpenCart}
          onOpen={onOpenCart}
          onClose={onCloseCart}
        />
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <Box>Logo</Box>
          <IconButton
            size={"md"}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={"Open Menu"}
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
          />

          <Flex alignItems={"center"}>
            <HStack spacing={8} alignItems={"center"}>
              <HStack
                as={"nav"}
                spacing={4}
                display={{ base: "none", md: "flex" }}
              >
                <NextLink href={"/signup"} passHref>
                  <Link>signup</Link>
                </NextLink>
                <NextLink href={"/login"} passHref>
                  <Link>login</Link>
                </NextLink>
                <Avatar size={"sm"} onClick={onOpenCart}>
                  <AvatarBadge boxSize="1.25em" bg="green.500">
                    {cart?.cartDetails.length || 0}
                  </AvatarBadge>
                </Avatar>
              </HStack>
            </HStack>
            <Menu>
              <MenuButton
                as={Button}
                rounded={"full"}
                variant={"link"}
                cursor={"pointer"}
              >
                <Avatar
                  size={"sm"}
                  src={
                    "https://images.unsplash.com/photo-1493666438817-866a91353ca9?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9"
                  }
                />
              </MenuButton>
              <MenuList>
                <MenuItem>profile</MenuItem>
                <MenuItem>orders</MenuItem>
                <MenuDivider />
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: "none" }}>
            <Stack as={"nav"} spacing={4}>
              <Link as={NextLink}>cart</Link>
              <Link as={NextLink}>login</Link>
              <Link as={NextLink}>signup</Link>
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  );
}
