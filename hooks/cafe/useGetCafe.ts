import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";

export default function useGetCafe(slug: string) {
  const supabaseClient = useSupabaseClient();

  const getCafe = async (slug: string) => {
    const { data: cafeteria, error } = await supabaseClient
      .from("cafeteria")
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

  return useQuery(["cafe"], () => getCafe(slug));
}
