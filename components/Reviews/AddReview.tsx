import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Select,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import useUser from "~hooks/auth/useUser";
import useAddReview from "~hooks/review/useAddReview";
import { ReviewWithUserAndCafeteria } from "~types";

interface AddReviewProps {
  cafeId: number;
  userReview: ReviewWithUserAndCafeteria | null;
}

const AddReview = ({ cafeId, userReview }: AddReviewProps) => {
  const { data: user } = useUser();
  const addReviewMutation = useAddReview();
  const [rating, setRating] = useState(userReview?.rating || 0);
  const [content, setContent] = useState(userReview?.content || "");

  useEffect(() => {
    setRating(userReview?.rating || 0);
    setContent(userReview?.content || "");
  }, [userReview]);

  const onSave = (e: FormEvent<HTMLInputElement>): void => {
    e.preventDefault();

    if (!user) return;

    addReviewMutation.mutate({
      cafeId,
      rating,
      content,
      userId: user.id,
    });
  };

  return (
    <Box p={2}>
      <VStack as="form" onSubmit={onSave}>
        <>
          <Heading as="h5">Your review about this cafe</Heading>
          <FormControl>
            <FormLabel>Rate your experience</FormLabel>
            <Select
              title="Rating"
              placeholder="Select a rating"
              value={rating}
              onChange={(e: ChangeEvent<HTMLSelectElement>): void =>
                setRating(Number(e.currentTarget.value))
              }
            >
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
              <option value={5}>5</option>
            </Select>
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Content</FormLabel>
            <Textarea
              placeholder="Say your mind"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </FormControl>
          {addReviewMutation.error && (
            <Text color="red" as="i">
              Could not add review
            </Text>
          )}
          <Button
            mt="2"
            colorScheme="blue"
            type="submit"
            isLoading={addReviewMutation.isLoading}
            loadingText="Saving..."
          >
            Save
          </Button>
        </>
      </VStack>
    </Box>
  );
};

export default AddReview;
