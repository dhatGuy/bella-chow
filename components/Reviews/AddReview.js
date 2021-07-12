import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Select,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useAuth } from "@context/AuthContext";
import { supabase } from "api";
import { useRef, useState } from "react";

const AddReview = ({ cafe }) => {
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState("");
  const { user } = useAuth();
  const [error, setError] = useState(null);

  const onSave = async (e) => {
    e.preventDefault();
    setError(null);
    if (!content || !rating) {
      setError("All fields required");
      return;
    }
    const { data, error } = await supabase
      .from("reviews")
      .insert([{ content, rating, cafe_id: cafe.id, user_id: user.id }]);

    console.log(data || error);
    setRating("");
    setContent("");
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
            <Input
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
          <Button mt="2" colorScheme="blue" type="submit">
            Save
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default AddReview;
