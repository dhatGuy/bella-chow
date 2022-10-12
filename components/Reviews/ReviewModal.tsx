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
import { useEffect, useState } from "react";
import useUser from "~hooks/auth/useUser";
import useGetReviews from "~hooks/review/useGetReviews";
import { Review as ReviewType } from "~types/types";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  cafeId: number;
}

export default function ReviewModal({
  isOpen,
  onClose,
  cafeId,
}: ReviewModalProps) {
  const [userReview, setUserReview] = useState<ReviewType | null>(null);
  const { data: user } = useUser();
  const { data: reviews, isLoading } = useGetReviews(cafeId, isOpen);

  useEffect(() => {
    setUserReview(
      reviews?.find((review) => review.user_id === user?.id) || null
    );
  }, [reviews, user]);

  if (isLoading) {
    return null;
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent as={Grid}>
        <ModalHeader>Reviews({reviews?.length})</ModalHeader>
        <ModalCloseButton />
        <Box
          style={{
            height: "20rem",
          }}
          overflow="auto"
          p="4"
          boxShadow="md"
        >
          {!reviews?.length ? (
            <Text>Ratings are still coming in</Text>
          ) : (
            reviews.map((review) => (
              <Review
                key={review.id}
                username={review.user.username}
                rating={review.rating}
                content={review.content}
                date={review.date}
              />
            ))
          )}
        </Box>
        {!!user && <AddReview cafeId={cafeId} userReview={userReview} />}
      </ModalContent>
    </Modal>
  );
}
