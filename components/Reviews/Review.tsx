import { Box, HStack, Text, VStack } from "@chakra-ui/react";
import Moment from "react-moment";
import Rating from "~components/Rating";

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
