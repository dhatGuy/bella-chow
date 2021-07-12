import AddReview from "./AddReview";
import Review from "./Review";

import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Grid,
  Box,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { supabase } from "api";

export default function ReviewModal({ isOpen, onClose, cafe }) {
  const [reviews, setReviews] = useState([]);
  useEffect(() => {
    const getReviews = async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select(`*, users(username), cafeterias(name)`)
        .eq("cafe_id", cafe.id);
      if (!error) {
        setReviews(data);
      }
      console.log(data || error);
    };
    getReviews();
  }, [cafe]);
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
                <>
                  <Review
                    username={review.users.username}
                    rating={review.rating}
                    content={review.content}
                    date={review.date}
                  />
                </>
              ))
            )}
          </Box>
          {/* </ModalBody> */}
          <AddReview cafe={cafe} />

          <ModalFooter>
            {/* <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant="ghost">Secondary Action</Button> */}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
