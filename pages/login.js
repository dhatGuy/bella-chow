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
  useToast,
} from "@chakra-ui/react";
import { useAuth } from "@context/AuthContext";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useRef, useState } from "react";

export default function Login() {
  const { signIn, forgotPassword } = useAuth();
  const router = useRouter();
  const emailRef = useRef();
  const passwordRef = useRef();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const toast = useToast();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    // Get email and password input values
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    // Calls `signIn` function from the context
    const { error } = await signIn({ email, password });

    if (error) {
      setError(error);
      setIsSubmitting(false);
    } else {
      setIsSubmitting(false);
      router.push(router.query.from || "/");
    }
  }

  const resetPassword = async () => {
    const { data, error } = await forgotPassword(emailRef.current.value);
    toast({
      position: "top-right",
      title: "Password Reset",
      description: "Check your mail",
      status: "success",
      duration: 5000,
    });
  };
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
                  <NextLink href={"/signup"} passHref>
                    <Link color={"blue.400"}>Sign-Up</Link>
                  </NextLink>
                  <Link color={"blue.400"} onClick={resetPassword}>
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
                  isLoading={isSubmitting}
                  loadingText="Submitting"
                >
                  Sign in
                </Button>
              </Stack>
            </Stack>
          </form>
        </Box>
      </Stack>
    </Flex>
  );
}
