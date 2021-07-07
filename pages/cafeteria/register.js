/* eslint-disable react/no-children-prop */
import React, { useState } from "react";
import {
  Box,
  Text,
  Stack,
  InputGroup,
  Input,
  InputLeftElement,
  Icon,
  FormLabel,
  Button,
  Divider,
  FormControl,
  Heading,
} from "@chakra-ui/react";

import { FaRegEnvelope, FaLock } from "react-icons/fa";

export default function Register() {
  const [isSubmitting, setSubmitting] = useState(false);
  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Demo: Submit registration form
    setSubmitting(true);
    setTimeout(function () {
      setSubmitting(false);
    }, 700);
    // End demo
  };
  return (
    <Box
      width={{ base: "90%", md: "400px" }}
      bg="secondary.card"
      rounded="lg"
      p={5}
    >
      <Heading marginBottom="1.5rem">Sign up</Heading>
      <form onSubmit={handleFormSubmit}>
        <Stack spacing={4} marginBottom="1rem">
          <FormControl>
            <FormLabel htmlFor="email">Email Address</FormLabel>
            <InputGroup>
              <InputLeftElement
                children={
                  <Icon as={FaRegEnvelope} color="secondary.inputHelper" />
                }
              />
              <Input
                focusBorderColor="main.500"
                type="email"
                name="email"
                id="email"
                placeholder="name@example.com"
              />
            </InputGroup>
          </FormControl>

          <FormControl>
            <Stack justifyContent="space-between" isInline>
              <FormLabel htmlFor="password">Password</FormLabel>
            </Stack>
            <InputGroup>
              <InputLeftElement
                children={<Icon as={FaLock} color="secondary.inputHelper" />}
              />
              <Input
                focusBorderColor="main.500"
                name="password"
                id="password"
                type="password"
                placeholder="Enter your password"
              />
            </InputGroup>
          </FormControl>

          <FormControl>
            <Stack justifyContent="space-between" isInline>
              <FormLabel htmlFor="password2">Confirm Password</FormLabel>
            </Stack>
            <InputGroup>
              <InputLeftElement
                children={<Icon as={FaLock} color="secondary.inputHelper" />}
              />
              <Input
                focusBorderColor="main.500"
                name="password2"
                id="password2"
                type="password"
                placeholder="Confirm your password"
              />
            </InputGroup>
          </FormControl>
        </Stack>
        <Stack marginBottom="1rem">
          <Button
            type="submit"
            isLoading={isSubmitting}
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
