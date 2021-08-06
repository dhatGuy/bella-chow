import { Box, Container, Heading, Text } from "@chakra-ui/react";
import Review from "@components/Reviews/Review";
import WithCafeAuth from "@components/WithCafeAuth";
import { useAuth } from "@context/AuthContext";
import { supabase } from "api";
import { useEffect } from "react";
import Moment from "react-moment";
import { useQuery } from "react-query";

const Reviews = () => {
  const { user } = useAuth();
  const getReviews = async () => {
    const { data, error } = await supabase
      .from("reviews")
      .select(`*, user:users(username)`)
      .eq("cafe_id", user.cafe[0].id);
    return data;
  };
  const {
    data: reviews,
    isLoading,
    error,
  } = useQuery(["reviews", user], getReviews);
  if (isLoading || error) {
    return <Box>Loading...</Box>;
  }

  return (
    <Container maxW="xl">
      <Heading as="h2" textAlign="center">
        Reviews
      </Heading>
      {reviews.map((review) => (
        <Box key={review.id} boxShadow="lg" p="3">
          <Review
            username={review.user.username}
            rating={review.rating}
            content={review.content}
            date={review.date}
          />
        </Box>
      ))}
    </Container>
  );
};

export default WithCafeAuth(Reviews);
