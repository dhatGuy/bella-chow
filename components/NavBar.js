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
  Heading,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";
import NextLink from "next/link";
import { useAuth } from "@context/AuthContext";

export default function Simple() {
  const { user } = useAuth();
  const { signOut } = useAuth();
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
  };

  return (
    <>
      <Box bg={useColorModeValue("gray.100", "gray.900")} px={4}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <Heading>
            <NextLink href="/" passHref>
              <Link _hover={{ textDecor: "none" }}>Bella Chow</Link>
            </NextLink>
          </Heading>
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
                {!user && (
                  <>
                    <NextLink href={"/signup"} passHref>
                      <Link>signup</Link>
                    </NextLink>
                    <NextLink href={"/login"} passHref>
                      <Link>login</Link>
                    </NextLink>
                  </>
                )}
                {user && (
                  <>
                    <NextLink href={"/cafeterias"} passHref>
                      <Link>Cafeterias</Link>
                    </NextLink>
                  </>
                )}
              </HStack>
            </HStack>
            <Menu isLazy>
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
              <MenuList zIndex={3}>
                <MenuItem>profile</MenuItem>
                <NextLink href="/orders" passHref>
                  <MenuItem _hover={{ textDecor: "none" }} as={Link}>
                    Orders
                  </MenuItem>
                </NextLink>
                <MenuDivider />
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: "none" }}>
            <Stack as={"nav"} spacing={4}>
              {!user && (
                <>
                  <NextLink href={"/signup"} passHref>
                    <Link>signup</Link>
                  </NextLink>
                  <NextLink href={"/login"} passHref>
                    <Link>login</Link>
                  </NextLink>
                </>
              )}
              {user && (
                <>
                  <NextLink href={"/cafeterias"} passHref>
                    <Link>Cafeterias</Link>
                  </NextLink>
                </>
              )}
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  );
}
