import { Box, Heading, Link, Stack } from "@chakra-ui/react";
import NextLink from "next/link";
import { useEffect, useState } from "react";
import Rating from "~components/Rating";
import { CafeteriaWithReviews } from "~types/types";

interface CafeteriaProps {
  cafe: CafeteriaWithReviews;
}

const Cafeteria = ({ cafe }: CafeteriaProps) => {
  const [avgRating, setAvgRating] = useState(0);
  useEffect(() => {
    const total = cafe.reviews.reduce(
      (total, review) => total + review.rating,
      0
    );
    setAvgRating(total / cafe.reviews.length);
  }, [cafe]);

  return (
    <NextLink href={`/cafeterias/${cafe.slug}`} passHref>
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
          <Box bgColor={"white"} p={2}>
            <Rating rating={avgRating} numReviews={cafe.reviews.length} />
          </Box>
        </Stack>
      </Link>
    </NextLink>
  );
};

export default Cafeteria;
