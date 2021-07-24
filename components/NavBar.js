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
          <Heading order={2}>
            <NextLink href="/" passHref>
              <Link _hover={{ textDecor: "none" }}>Bella Chow</Link>
            </NextLink>
          </Heading>
          <Flex alignItems={"center"} order={2}>
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
                {user?.cafe_owner && (
                  <>
                    <NextLink href={"/dashboard"} passHref>
                      <Link>Dashboard</Link>
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
            {user && (
              <Menu isLazy>
                <MenuButton
                  as={Button}
                  rounded={"full"}
                  variant={"link"}
                  cursor={"pointer"}
                >
                  <Avatar size={"sm"} src={""} name={user.username} />
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
            )}
          </Flex>
          <IconButton
            size={"md"}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={"Open Menu"}
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
          />
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
              {user?.cafe_owner && (
                <>
                  <NextLink href={"/dashboard"} passHref>
                    <Link>Dashboard</Link>
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
