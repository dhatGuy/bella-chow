import { Box, HStack, Stack, Text, VStack } from "@chakra-ui/react";
import Rating from "@components/Rating";
import Moment from "react-moment";

const Review = ({ username, date, content, rating }) => {
  return (
    <VStack align="stretch" mb="4">
      <HStack justify="space-between">
        <Box>
          <Text fontWeight="bold">@{username}</Text>
          <Text>
            <Moment format="ddd LL">{date}</Moment>
          </Text>
        </Box>
        <Rating rating={rating} />
      </HStack>
      <Box>
        <Text>{content}</Text>
      </Box>
    </VStack>
  );
};

export default Review;
