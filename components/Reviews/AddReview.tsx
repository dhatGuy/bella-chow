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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useAuth } from "~context/AuthContext";
import { supabase } from "~lib/api";

const AddReview = ({ cafe, userReview }) => {
  const [rating, setRating] = useState(userReview?.rating || 0);
  const [content, setContent] = useState(userReview?.content || "");
  const { user } = useAuth();
  const [error, setError] = useState(null);
  const queryClient = useQueryClient();

  const mutation = useMutation(
    async () => {
      const { data, error } = await supabase
        .from("reviews")
        .upsert([{ content, rating, cafe_id: cafe.id, user_id: user.id }]);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("reviews");
      },
    }
  );

  const onSave = async (e) => {
    e.preventDefault();
    setError(null);
    if (!content || !rating) {
      setError("All fields required");
      return;
    }
    mutation.mutate();
  };
  return (
    <Box p={2}>
      <form onSubmit={onSave}>
        <VStack align="stretch">
          <Heading as="h5">Your review about this cafe</Heading>
          <FormControl>
            <FormLabel>Rate your experience</FormLabel>
            <Select
              placeholder="Select option"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
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
          {error && (
            <Text color="red" as="i">
              {error}
            </Text>
          )}
          <Button
            mt="2"
            colorScheme="blue"
            type="submit"
            isLoading={mutation.isLoading}
            loadingText="Saving..."
          >
            Save
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default AddReview;
