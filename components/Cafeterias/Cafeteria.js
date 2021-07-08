import { Link, Box, Heading, Stack } from "@chakra-ui/react";
import NextLink from "next/link";
const Cafeteria = ({ cafe }) => {
  return (
    <NextLink href={`/cafeterias/${cafe.id}`} passHref>
      <Link _hover={{ textDecor: "none" }}>
        <Stack
          position="relative"
          bgColor="black"
          height={"36"}
          alignItems="center"
          bgImg={`${cafe.image}`}
          bgSize="cover"
          bgRepeat="no-repeat"
          bgPos={"center center"}
          justify="center"
          transition="all 1s"
          _before={{
            content: '""',
            position: "absolute",
            top: "0px",
            right: "0px",
            bottom: "0px",
            left: "0px",
            backgroundColor: "rgba(0,0,0,0.25)",
          }}
          _hover={{ transform: "scale(1.1)" }}
        >
          <Heading as={"h1"} textColor="white" zIndex={2}>
            {cafe.name}
          </Heading>
        </Stack>
      </Link>
    </NextLink>
  );
};

export default Cafeteria;
