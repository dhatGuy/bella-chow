/* eslint-disable react/no-children-prop */
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";

import { FaRegEnvelope, FaUser } from "react-icons/fa";
import { IoFastFoodOutline, IoLockClosedOutline } from "react-icons/io5";
import useCreateCafe from "~hooks/cafe/useCreateCafe";

type FormData = {
  email: string;
  password: string;
  cafeName: string;
  role: "CAFE_OWNER";
  username: string;
};

export default function Register() {
  const createCafe = useCreateCafe();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      role: "CAFE_OWNER",
    },
  });

  const onSubmit = handleSubmit((formData) => createCafe.mutate(formData));

  return (
    <Box
      width={{ base: "90%", md: "400px" }}
      bg="secondary.card"
      rounded="lg"
      p={5}
    >
      <Heading marginBottom="1.5rem">Sign up</Heading>
      <form onSubmit={onSubmit}>
        <Stack spacing={4} marginBottom="1rem">
          <FormControl id="cafeName" isInvalid={!!errors.cafeName}>
            <FormLabel htmlFor="cafeName">Cafeteria Name</FormLabel>
            <InputGroup>
              <InputLeftElement
                children={
                  <Icon as={IoFastFoodOutline} color="secondary.inputHelper" />
                }
              />
              <Input
                type="text"
                focusBorderColor="main.500"
                id="cafeName"
                placeholder="Cafe Name"
                {...register("cafeName", {
                  required: "Cafe Name is required",
                  minLength: {
                    value: 3,
                    message: "Cafe Name must be at least 3 characters",
                  },
                  maxLength: {
                    value: 20,
                    message: "Cafe Name must be at most 20 characters",
                  },
                })}
              />
            </InputGroup>
            <FormErrorMessage>{errors.cafeName?.message}</FormErrorMessage>
          </FormControl>
          <FormControl id="email" isInvalid={!!errors.username}>
            <FormLabel htmlFor="email">Username</FormLabel>
            <InputGroup>
              <InputLeftElement
                children={<Icon as={FaUser} color="secondary.inputHelper" />}
              />
              <Input
                type="text"
                focusBorderColor="main.500"
                id="email"
                placeholder="username"
                {...register("username", {
                  required: "Username is required",
                })}
              />
            </InputGroup>
            <FormErrorMessage>{errors.username?.message}</FormErrorMessage>
          </FormControl>
          <FormControl id="email" isInvalid={!!errors.email}>
            <FormLabel htmlFor="email">Email Address</FormLabel>
            <InputGroup>
              <InputLeftElement
                children={
                  <Icon as={FaRegEnvelope} color="secondary.inputHelper" />
                }
              />
              <Input
                type="email"
                focusBorderColor="main.500"
                id="email"
                placeholder="name@example.com"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
              />
            </InputGroup>
            <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
          </FormControl>
          <FormControl id="password" isInvalid={!!errors.password}>
            <FormLabel htmlFor="password">Password</FormLabel>
            <InputGroup>
              <InputLeftElement
                children={
                  <Icon
                    as={IoLockClosedOutline}
                    color="secondary.inputHelper"
                  />
                }
              />
              <Input
                focusBorderColor="main.500"
                id="password"
                type="password"
                placeholder="Enter your password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must have at least 6 characters",
                  },
                })}
              />
            </InputGroup>
            <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
          </FormControl>
        </Stack>
        {createCafe.isError && (
          <Text textColor="red" mb="1">
            {(createCafe.error instanceof Error && createCafe.error.message) ||
              "Something went wrong"}
          </Text>
        )}
        <Stack marginBottom="1rem">
          <Button
            type="submit"
            isLoading={createCafe.isLoading}
            loadingText="Please wait.."
            colorScheme="teal"
          >
            Sign up
          </Button>
        </Stack>
      </form>
      <Divider marginBottom="1rem" />
      <Stack>
        <Text textAlign="center" fontWeight="500">
          Already have an account?
        </Text>
        <Button colorScheme="teal" variant="outline">
          Sign in
        </Button>
      </Stack>
    </Box>
  );
}
