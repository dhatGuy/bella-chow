import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "~lib/api";

const signOut = async () => {
  let { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message);
  }
};

export default function useLogout() {
  const queryClient = useQueryClient();
  return useMutation(() => signOut(), {
    onSuccess: () => {
      queryClient.removeQueries();
    },
  });
}
