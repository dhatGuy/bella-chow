import { useQuery } from "@tanstack/react-query";
import { supabase } from "~lib/api";

async function getMenu(id?: number) {
  const { data, error } = await supabase
    .from("menu")
    .select()
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);

  return data;
}

export default function useMenu(id?: number) {
  return useQuery(["menu", id], () => getMenu(id));
}
