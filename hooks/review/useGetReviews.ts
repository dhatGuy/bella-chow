import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";

export default function useGetReviews(cafeId: number, isOpen: boolean) {
  const supabaseClient = useSupabaseClient();

  const getReviews = async (cafeId: number) => {
    const { data, error } = await supabaseClient
      .from("review")
      .select(`*, user(username), cafeteria(name)`)
      .eq("cafe_id", cafeId);

    if (error) {
      throw new Error(error.message);
    }
    return data;
  };

  return useQuery(["reviews", cafeId], () => getReviews(cafeId), {
    enabled: isOpen,
    onSuccess: (data) => {},
  });
}
