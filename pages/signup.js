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
} from "@chakra-ui/react";
import { useAuth } from "@context/AuthContext";
import { supabase } from "api";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useRef, useState } from "react";

export default function Signup() {
  const { signUp, setUser } = useAuth();
  const emailRef = useRef();
  const passwordRef = useRef();
  const usernameRef = useRef();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  async function createProfile(userId) {
    const username = usernameRef.current.value;
    const { data, error } = await supabase
      .from("users")
      .insert([{ username, id: userId }]);
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Get email and password input values
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    const { user, error } = await signUp({ email, password });

    if (error) {
      setError(error);
      setIsSubmitting(false);
    } else {
      await createProfile(user.id);
      setUser(user);
      router.push("/");
      setIsSubmitting(false);
    }
  };

  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <form onSubmit={handleSubmit}>
        <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
          <Stack align={"center"}>
            <Heading fontSize={"4xl"}>Create an account</Heading>
            <Text fontSize={"lg"} color={"gray.600"}>
              to enjoy free delivery within the campus ✌️
            </Text>
          </Stack>
          <Box
            rounded={"lg"}
            bg={useColorModeValue("white", "gray.700")}
            boxShadow={"lg"}
            p={8}
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
              {error && (
                <Text textColor="red" as="i">
                  {error.message}
                </Text>
              )}
              <Stack spacing={10}>
                <Stack
                  direction={{ base: "column", sm: "row" }}
                  align={"start"}
                  justify={"space-between"}
                >
                  <NextLink href={"/login"} passHref>
                    <Link color={"blue.400"}>Login</Link>
                  </NextLink>
                </Stack>
                <Button
                  type="submit"
                  bg={"blue.400"}
                  color={"white"}
                  _hover={{
                    bg: "blue.500",
                  }}
                  isLoading={isSubmitting}
                  loadingText="Submitting"
                >
                  Sign-up
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </form>
    </Flex>
  );
}
