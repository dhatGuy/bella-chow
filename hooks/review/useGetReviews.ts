import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { ReviewWithUserAndCafeteria } from "~types";
import { Database } from "~types/supabase";

export default function useGetReviews(cafeId: number, isOpen: boolean) {
  const supabaseClient = useSupabaseClient<Database>();

  const getReviews = async (cafeId: number) => {
    const { data, error } = await supabaseClient
      .from("review")
      .select(`*, user(username), cafeteria(name)`)
      .eq("cafe_id", cafeId);

    if (error) {
      throw new Error(error.message);
    }
    return data as ReviewWithUserAndCafeteria[];
  };

  return useQuery(["reviews", cafeId], () => getReviews(cafeId), {
    enabled: isOpen,
    onSuccess: (data) => {},
  });
}
