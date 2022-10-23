import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "~lib/api";
import { Review } from "~types";

interface IAddReview {
  content: string;
  rating: number;
  cafeId: number;
  userId: string;
}

const addReview = async ({ content, rating, cafeId, userId }: IAddReview) => {
  const { data, error } = await supabase
    .from<Review>("review")
    .upsert([{ content, rating, cafe_id: cafeId, user_id: userId }]);

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export default function useAddReview() {
  const queryClient = useQueryClient();

  return useMutation((input: IAddReview) => addReview(input), {
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["reviews", variables.cafeId]);
      queryClient.invalidateQueries(["cafe"]);
    },
  });
}
