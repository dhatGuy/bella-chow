import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { CafeteriaWithMenuAndReviews } from "~types";
import { Database } from "~types/supabase";

export default function useGetCafe(slug?: string) {
  const supabaseClient = useSupabaseClient<Database>();

  const getCafe = async (slug?: string) => {
    if (!slug) return null;

    const { data: cafeteria, error } = await supabaseClient
      .from("cafeteria")
      .select(
        `*, 
      menuCategories:menu_category(*, menus:menu(*)), 
      menus:menu(*), 
      reviews:review(*)`
      )
      .eq("slug", slug)
      .returns<CafeteriaWithMenuAndReviews>()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return cafeteria;
  };

  return useQuery(["cafe", slug], () => getCafe(slug));
}
