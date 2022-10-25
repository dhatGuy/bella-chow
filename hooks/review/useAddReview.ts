import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface IAddReview {
  content: string;
  rating: number;
  cafeId: number;
  userId: string;
}

export default function useAddReview() {
  const queryClient = useQueryClient();
  const supabaseClient = useSupabaseClient();

  const addReview = async ({ content, rating, cafeId, userId }: IAddReview) => {
    const { data, error } = await supabaseClient
      .from("review")
      .upsert([{ content, rating, cafe_id: cafeId, user_id: userId }]);

    if (error) {
      throw new Error(error.message);
    }

    return data;
  };

  return useMutation((input: IAddReview) => addReview(input), {
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["reviews", variables.cafeId]);
      queryClient.invalidateQueries(["cafe"]);
    },
  });
}
