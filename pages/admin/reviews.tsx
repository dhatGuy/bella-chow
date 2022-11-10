import { Box, Container, Heading } from "@chakra-ui/react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import AdminLayout from "~components/AdminLayout";
import Review from "~components/Reviews/Review";
import useProfile from "~hooks/auth/useProfile";
import { Database } from "~types/supabase";

const Reviews = () => {
  const { data: user } = useProfile();
  const supabaseClient = useSupabaseClient<Database>();
  const getReviews = async () => {
    const { data, error } = await supabaseClient
      .from("review")
      .select(`*, user(username), cafeteria(name)`)
      .eq("cafe_id", user?.cafeteria.id);

    return data;
  };
  const {
    data: reviews,
    isLoading,
    error,
  } = useQuery(["reviews", user?.cafeteria.id], getReviews);

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
            username={review.username}
            rating={review.rating}
            comment={review.comment}
            date={review.date}
          />
        </Box>
      ))}
    </Container>
  );
};

export default Reviews;

Reviews.getLayout = (page: React.ReactElement) => (
  <AdminLayout>{page}</AdminLayout>
);
