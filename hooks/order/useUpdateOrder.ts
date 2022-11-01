import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Database } from "~types/supabase";

type Update = {
  id: number;
  status: "pending" | "accepted" | "rejected";
};

export default function useUpdateOrder() {
  const supabaseClient = useSupabaseClient<Database>();
  const queryClient = useQueryClient();

  const updateOrder = async ({ id, status }: Update) => {
    const { data, error } = await supabaseClient
      .from("order")
      .update({ status })
      .match({ id });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  };

  return useMutation((update: Update) => updateOrder(update), {
    onSuccess: () => {
      queryClient.invalidateQueries(["orders"]);
    },
  });
}
