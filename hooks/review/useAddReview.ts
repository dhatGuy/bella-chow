import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useProfile from "~hooks/auth/useProfile";
import { Database } from "~types/supabase";

interface AddReview {
  comment: string;
  rating: number;
  cafeId: number;
}

export default function useAddReview() {
  const queryClient = useQueryClient();
  const supabaseClient = useSupabaseClient<Database>();
  const { data: user } = useProfile();

  const addReview = async ({ comment, rating, cafeId }: AddReview) => {
    if (!user) {
      throw new Error("You must be logged in to add a review");
    }

    const { data, error } = await supabaseClient.from("review").upsert([
      {
        rating,
        comment,
        cafe_id: cafeId,
        user_id: user.id,
        username: user.username,
      },
    ]);

    if (error) {
      throw new Error(error.message);
    }

    return data;
  };

  return useMutation((input: AddReview) => addReview(input), {
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["reviews", variables.cafeId]);
      queryClient.invalidateQueries(["cafe"]);
    },
  });
}
