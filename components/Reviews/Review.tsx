import { Box, HStack, Text, VStack } from "@chakra-ui/react";
import dayjs from "dayjs";
import Rating from "~components/Rating";

interface ReviewProps {
  username: string;
  date: string;
  comment: string;
  rating: number;
}

const Review = ({ username, date, comment, rating }: ReviewProps) => {
  return (
    <VStack align="stretch" mb="4">
      <HStack justify="space-between">
        <Box>
          <Text fontWeight="bold">{username}</Text>
          <Text>{dayjs(date).format("D MMM YYYY, h:mm A")}</Text>
        </Box>
        <Rating rating={rating} />
      </HStack>
      <Box>
        <Text>{comment}</Text>
      </Box>
    </VStack>
  );
};

export default Review;
