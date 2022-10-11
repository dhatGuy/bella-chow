import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Link,
  Stack,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useRef } from "react";
import ResetPassword from "~components/ResetPassword";
import useLogin from "~hooks/auth/useLogin";

export default function Login() {
  const router = useRouter();
  const emailRef = useRef();
  const passwordRef = useRef();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const loginMutation = useLogin();

  async function handleSubmit(e) {
    e.preventDefault();

    // Get email and password input values
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    loginMutation.mutate(
      {
        email,
        password,
      },
      {
        onSuccess: () => {
          router.push((router.query.from as string) || "/");
        },
      }
    );
  }

  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"}>Sign in to your account</Heading>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          <form onSubmit={handleSubmit}>
            <Stack spacing={4}>
              <FormControl id="email">
                <FormLabel>Email address</FormLabel>
                <Input type="email" ref={emailRef} />
              </FormControl>
              <FormControl id="password">
                <FormLabel>Password</FormLabel>
                <Input type="password" ref={passwordRef} />
              </FormControl>
              {loginMutation.isError && (
                <Text textColor="red" as="i">
                  {loginMutation.error.message}
                </Text>
              )}
              <Stack spacing={10}>
                <Stack
                  direction={{ base: "column", sm: "row" }}
                  align={"start"}
                  justify={"space-between"}
                >
                  <NextLink href={"/signup"} passHref>
                    <Link color={"blue.400"}>Sign-Up</Link>
                  </NextLink>
                  <Link color={"blue.400"} onClick={onOpen}>
                    Forgot password?
                  </Link>
                </Stack>
                <Button
                  type="submit"
                  bg={"blue.400"}
                  color={"white"}
                  _hover={{
                    bg: "blue.500",
                  }}
                  isLoading={loginMutation.isLoading}
                  loadingText="Submitting"
                >
                  Sign in
                </Button>
              </Stack>
            </Stack>
          </form>
        </Box>
      </Stack>
      <ResetPassword isOpen={isOpen} onOpen={onOpen} onClose={onClose} />
    </Flex>
  );
}
