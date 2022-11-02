import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Select,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import useAddReview from "~hooks/review/useAddReview";
import { ReviewWithUserAndCafeteria } from "~types";

interface AddReviewProps {
  cafeId: number;
  userReview: ReviewWithUserAndCafeteria | undefined;
}

type FormData = {
  rating: number;
  comment: string;
};

const AddReview = ({ cafeId, userReview }: AddReviewProps) => {
  const addReviewMutation = useAddReview();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  useEffect(() => {
    if (userReview) {
      reset({
        rating: userReview.rating || 0,
        comment: userReview.comment || "",
      });
    }
  }, [reset, userReview]);

  const onSave = handleSubmit((values) => {
    addReviewMutation.mutate({
      ...values,
      cafeId,
    });
  });

  return (
    <Box p={2}>
      <VStack as="form" onSubmit={onSave}>
        <>
          <Heading as="h5">Your review about this cafe</Heading>

          <FormControl isInvalid={!!errors.rating} id="rating">
            <FormLabel>Rate your experience</FormLabel>
            <Select
              title="Rating"
              placeholder="Select a rating"
              {...register("rating", { required: "Rating is required" })}
            >
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
              <option value={5}>5</option>
            </Select>
            <FormErrorMessage>{errors.rating?.message}</FormErrorMessage>
          </FormControl>

          <FormControl mt={4} isInvalid={!!errors.comment} id="comment">
            <FormLabel>Comment</FormLabel>
            <Textarea
              title="Comment"
              placeholder="Write your comment here"
              {...register("comment", {
                minLength: {
                  value: 10,
                  message: "Comment must be at least 10 characters",
                },
              })}
            />
          </FormControl>
          {addReviewMutation.isError ? (
            <Text textColor="red" as="i">
              {addReviewMutation.error instanceof Error
                ? addReviewMutation.error.message
                : "Something went wrong"}
            </Text>
          ) : null}
          <Button
            mt="2"
            w="full"
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
