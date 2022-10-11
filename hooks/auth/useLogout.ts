import { useMutation, useQueryClient } from "@tanstack/react-query";
import Router from "next/router";
import { supabase } from "~lib/api";

const signOut = async () => {
  let { error } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }
};

export default function useLogout() {
  const queryClient = useQueryClient();
  return useMutation(() => signOut(), {
    onSuccess: () => {
      queryClient.removeQueries();
      Router.push("/");
    },
  });
}
