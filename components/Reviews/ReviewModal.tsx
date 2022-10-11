import AddReview from "./AddReview";
import Review from "./Review";

import {
  Box,
  Grid,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useAuth } from "~context/AuthContext";
import { supabase } from "~lib/api";

export default function ReviewModal({ isOpen, onClose, cafe }) {
  const [userReview, setUserReview] = useState(null);
  const { user } = useAuth();
  const { data: reviews, isLoading } = useQuery(["reviews"], getReviews);

  async function getReviews() {
    const { data, error } = await supabase
      .from("reviews")
      .select(`*, users(username), cafeterias(name)`)
      .eq("cafe_id", cafe.id);

    if (!error) {
      setUserReview(data.filter((review) => review.user_id === user?.id)[0]);
      return data;
    }
  }
  if (isLoading) {
    return <Box></Box>;
  }
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent as={Grid}>
          <ModalHeader>Reviews</ModalHeader>
          <ModalCloseButton />
          {/* <ModalBody> */}
          <Box
            style={{
              height: "20rem",
            }}
            overflow="auto"
            p="4"
            boxShadow="md"
          >
            {!reviews.length ? (
              <>
                <Text>Ratings are still coming in</Text>
              </>
            ) : (
              reviews.map((review) => (
                <Review
                  key={review.id}
                  username={review.users.username}
                  rating={review.rating}
                  content={review.content}
                  date={review.date}
                />
              ))
            )}
          </Box>
          {user && <AddReview cafe={cafe} userReview={userReview} />}
        </ModalContent>
      </Modal>
    </>
  );
}
