import { Box, Text } from "@chakra-ui/react";
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
  const { data: reviews, isLoading } = useQuery(["reviews", user], getReviews);
  if (isLoading) {
    return <Box>Loading...</Box>;
  }

  return (
    <Box>
      {reviews.map((review) => (
        <div key={review.id}>
          <h3>{review.rating}</h3>
          <p>{review.content}</p>
          <p>{review.user.username}</p>
          <Text>
            <Moment>{review.date}</Moment>
          </Text>
        </div>
      ))}
    </Box>
  );
};

export default Reviews;
