import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { Database } from "~types/supabase";

export default function useGetCafes() {
  const supabaseClient = useSupabaseClient<Database>();

  const getCafeterias = async () => {
    const { data, error } = await supabaseClient
      .from("cafeteria")
      .select(`*, reviews:review(*)`);

    if (error) {
      throw new Error(error.message);
    }

    return data;
  };

  return useQuery(["cafes"], getCafeterias);
}
