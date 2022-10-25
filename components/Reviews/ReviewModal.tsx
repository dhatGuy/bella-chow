import AddReview from "./AddReview";
import Review from "./Review";

import {
  Box,
  Center,
  Grid,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
} from "@chakra-ui/react";
import useUser from "~hooks/auth/useProfile";
import useGetReviews from "~hooks/review/useGetReviews";

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
  const { data: reviews, isLoading } = useGetReviews(cafeId, isOpen);
  const { data: user } = useUser();

  let userReview =
    reviews?.find((review) => review.user_id === user?.id) || null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent as={Grid}>
        <ModalHeader>Reviews({reviews?.length || 0})</ModalHeader>
        <ModalCloseButton />
        <Box
          style={{
            height: "20rem",
          }}
          overflow="auto"
          p="4"
          boxShadow="md"
        >
          {!!isLoading ? (
            <Center>
              <Spinner />
            </Center>
          ) : !reviews?.length ? (
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
