import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Link,
  Stack,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { useUser } from "@supabase/auth-helpers-react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import useCreateUser from "~hooks/auth/useCreateUser";

type FormData = {
  email: string;
  password: string;
  username: string;
};

export default function Signup() {
  const router = useRouter();
  const createUserMutation = useCreateUser();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormData>();
  const user = useUser();

  useEffect(() => {
    if (user && !user.user_metadata?.role) {
      router.push("/");
    } else if (user) {
      router.push("/admin");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const onSubmit = handleSubmit((data) => {
    createUserMutation.mutate(data, {
      onSuccess: (user) => {
        user?.user_metadata?.role === "CUSTOMER"
          ? router.push("/")
          : router.push("/admin");
      },
    });
  });

  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <form onSubmit={onSubmit}>
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
              <FormControl id="email" isInvalid={!!errors.email}>
                <FormLabel>Email address</FormLabel>
                <Input
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                />
                <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
              </FormControl>
              <FormControl id="username" isInvalid={!!errors.username}>
                <FormLabel>Username</FormLabel>
                <Input
                  type="text"
                  {...register("username", {
                    required: "Username is required",
                    minLength: {
                      value: 4,
                      message: "Minimum length should be 4",
                    },
                  })}
                />
                <FormErrorMessage>{errors.username?.message}</FormErrorMessage>
              </FormControl>
              <FormControl id="password" isInvalid={!!errors.password}>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Minimum length should be 6",
                    },
                  })}
                />
                <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
              </FormControl>
              {createUserMutation.isError && (
                <Text textColor="red" as="i">
                  {(createUserMutation.error instanceof Error &&
                    createUserMutation.error.message) ||
                    "Something went wrong"}
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
