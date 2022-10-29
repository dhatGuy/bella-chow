import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import useProfile from "~hooks/auth/useProfile";
import { Database } from "~types/supabase";

export default function useMenus() {
  const supabase = useSupabaseClient<Database>();
  const { data: user } = useProfile();

  const getMenus = async () => {
    if (!user) return null;

    const { data, error } = await supabase
      .from("menu")
      .select()
      .eq("cafe_id", user.cafeteria.id);

    return data;
  };

  return useQuery(["menus", user?.cafeteria.id], getMenus);
}
