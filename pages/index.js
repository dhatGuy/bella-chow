import Head from "next/head";

import {
  Flex,
  Heading,
  Stack,
  Text,
  Button,
  Container,
  Link,
} from "@chakra-ui/react";
import NextLink from "next/link";
import Lottie from "react-lottie";
import anime from "lotties/food-delivery-process";
import { useAuth } from "@context/AuthContext";

export default function Homepage() {
  const { user } = useAuth();
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: anime,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return (
    <Container maxW={"5xl"}>
      <Stack
        textAlign={"center"}
        align={"center"}
        spacing={{ base: 8, md: 10 }}
        py={{ base: 20, md: 28 }}
      >
        <Heading
          fontWeight={600}
          fontSize={{ base: "3xl", sm: "4xl", md: "6xl" }}
          lineHeight={"110%"}
        >
          Ordering food{" "}
          <Text as={"span"} color={"orange.400"}>
            made easy
          </Text>
        </Heading>
        <Text color={"gray.500"} maxW={"3xl"}>
          Are you in Redeemer&quot;s University and you are hungry? You are just
          an order away
        </Text>
        <Stack spacing={6} direction={"row"}>
          <NextLink href="/signup" passHref>
            <Button
              as={Link}
              rounded={"full"}
              px={6}
              colorScheme={"orange"}
              bg={"orange.400"}
              _hover={{ bg: "orange.500" }}
            >
              Cafeterias
            </Button>
          </NextLink>
          {!user && (
            <NextLink href="/login" passHref>
              <Button as={Link} rounded={"full"} px={6}>
                Login
              </Button>
            </NextLink>
          )}
        </Stack>
        <Flex w={"full"}>
          <Lottie options={defaultOptions} height={400} width={400} />
        </Flex>
      </Stack>
    </Container>
  );
}
