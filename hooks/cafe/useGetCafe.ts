import { useQuery } from "@tanstack/react-query";
import { supabase } from "~lib/api";
import { CafeteriaWithMenuAndReviews } from "~types";

const getCafe = async (slug: string) => {
  const { data: cafeteria, error } = await supabase
    .from<CafeteriaWithMenuAndReviews>("cafeteria")
    .select(
      `*, 
      menuCategories:menu_category(*, menus:menu(*)), 
      menus:menu(*), 
      reviews:review(*)`
    )
    .eq("slug", slug)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return cafeteria;
};

export default function useGetCafe(slug: string) {
  return useQuery(["cafe"], () => getCafe(slug));
}
