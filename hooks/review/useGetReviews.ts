import { useQuery } from "@tanstack/react-query";
import { supabase } from "~lib/api";
import { ReviewWithUserAndCafeteria } from "~types/types";

const getReviews = async (cafeId: number) => {
  const { data, error } = await supabase
    .from<ReviewWithUserAndCafeteria>("review")
    .select(`*, user(username), cafeteria(name)`)
    .eq("cafe_id", cafeId);

  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export default function useGetReviews(cafeId: number, isOpen: boolean) {
  return useQuery(["reviews", cafeId], () => getReviews(cafeId), {
    enabled: isOpen,
    onSuccess: (data) => {},
  });
}
