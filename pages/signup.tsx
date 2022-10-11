import {
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
  VStack,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useRef } from "react";
import { useSnapshot } from "valtio";
import { state } from "~context/state";
import useCreateUser from "~hooks/auth/useCreateUser";

export default function Signup() {
  const emailRef = useRef<HTMLInputElement | null>();
  const passwordRef = useRef<HTMLInputElement | null>();
  const usernameRef = useRef<HTMLInputElement | null>();
  const router = useRouter();
  const createUserMutation = useCreateUser();
  const { authenticated } = useSnapshot(state);

  useEffect(() => {
    // redirect to home if already logged in
    if (authenticated) {
      router.push("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Get email and password input values
    const email = emailRef.current?.value;
    const username = usernameRef.current?.value;
    const password = passwordRef.current?.value;

    createUserMutation.mutate({
      username,
      email,
      password,
    });
  };

  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <form onSubmit={handleSubmit}>
        <Stack spacing={8} mx={"auto"} maxW={"xl"} py={12} px={6}>
          <Stack align={"center"}>
            <Heading fontSize={"4xl"}>Create an account</Heading>
            <Text fontSize={"lg"} color={"gray.600"}>
              to enjoy free delivery within the campus ✌️
            </Text>
          </Stack>
          <VStack
            rounded={"lg"}
            bg={useColorModeValue("white", "gray.700")}
            boxShadow={"lg"}
            p={8}
            spacing={6}
            alignItems={"stretch"}
          >
            <Stack spacing={4}>
              <FormControl id="email">
                <FormLabel>Email address</FormLabel>
                <Input type="email" ref={emailRef} />
              </FormControl>
              <FormControl id="username">
                <FormLabel>Username</FormLabel>
                <Input type="text" ref={usernameRef} />
              </FormControl>
              <FormControl id="password">
                <FormLabel>Password</FormLabel>
                <Input type="password" ref={passwordRef} />
              </FormControl>
              {createUserMutation.isError && (
                <Text textColor="red" as="i">
                  {createUserMutation.error.message}
                </Text>
              )}
            </Stack>
            <Stack spacing={1}>
              <Button
                type="submit"
                bg={"blue.400"}
                color={"white"}
                _hover={{
                  bg: "blue.500",
                }}
                isLoading={createUserMutation.isLoading}
                loadingText="Submitting"
              >
                Sign-up
              </Button>
              <NextLink href={"/login"} passHref>
                <Link color={"blue.400"}>Don&apos;t have an account?</Link>
              </NextLink>
            </Stack>
          </VStack>
        </Stack>
      </form>
    </Flex>
  );
}
