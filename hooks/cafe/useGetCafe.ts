import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { Database } from "~types/supabase";

type Cafeterias = Database["public"]["Tables"]["cafeteria"]["Row"];
type Menus = Database["public"]["Tables"]["menu"]["Row"];
type Reviews = Database["public"]["Tables"]["review"]["Row"];
type Categories = Database["public"]["Tables"]["menu_category"]["Row"];
type CafeteriasResponseSuccess = Cafeterias & {
  menuCategories: Categories[] &
    {
      menus: Menus[];
    }[];
  menus: Menus[];
  reviews: Reviews[];
};

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
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return cafeteria as CafeteriasResponseSuccess;
  };

  return useQuery(["cafe", slug], () => getCafe(slug));
}
