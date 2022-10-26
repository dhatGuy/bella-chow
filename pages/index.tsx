import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Icon,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import anime from "assets/food-choose.json";
import NextLink from "next/link";
import { GiFoodTruck, GiStorkDelivery } from "react-icons/gi";
import { IoFastFoodOutline } from "react-icons/io5";
import Lottie from "react-lottie";
import useProfile from "~hooks/auth/useProfile";

const Feature = ({
  title,
  text,
  icon,
}: {
  title: string;
  text: string;
  icon: React.ReactNode;
}) => {
  return (
    <Stack align="center">
      <Flex
        w={16}
        h={16}
        align={"center"}
        justify={"center"}
        color={"white"}
        rounded={"full"}
        bg={"orange.400"}
        _hover={{ bg: "orange.500" }}
        mb={1}
      >
        {icon}
      </Flex>
      <Text fontWeight={600}>{title}</Text>
      <Text color={"gray.600"}>{text}</Text>
    </Stack>
  );
};

export default function Homepage() {
  const { isError } = useProfile();
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
          <NextLink href="/cafeterias" passHref>
            <Button
              rounded={"full"}
              px={6}
              bg={"orange.400"}
              _hover={{ bg: "orange.500" }}
            >
              Cafeterias List
            </Button>
          </NextLink>
          {isError && (
            <NextLink href="/login" passHref>
              <Button rounded={"full"} px={6}>
                Login
              </Button>
            </NextLink>
          )}
        </Stack>
        <Flex w={"full"}>
          <Lottie options={defaultOptions} height={400} width={400} />
        </Flex>
        <Box p={4}>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
            <Feature
              icon={<Icon as={GiFoodTruck} w={10} h={10} />}
              title={"Fast Delivery"}
              text={"Delivery in 30mins. It's a promise!"}
            />
            <Feature
              icon={<Icon as={GiStorkDelivery} w={10} h={10} />}
              title={"Pick up"}
              text={"Pickup delivery at your doorstep"}
            />
            <Feature
              icon={<Icon as={IoFastFoodOutline} w={10} h={10} />}
              title={"Dine in"}
              text={"Enjoy your food fresh crispy and hot"}
            />
          </SimpleGrid>
        </Box>
      </Stack>
    </Container>
  );
}
