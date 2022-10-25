import { Box, Container, Heading } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import Review from "~components/Reviews/Review";
import WithCafeAuth from "~components/WithCafeAuth";
import useProfile from "~hooks/auth/useProfile";
import { supabase } from "~lib/api";

const Reviews = () => {
  const { data: user } = useProfile();
  const getReviews = async () => {
    const { data, error } = await supabase
      .from("reviews")
      .select(`*, user:users(username)`);
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
      {reviews?.map((review) => (
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
