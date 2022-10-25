import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useLogout() {
  const supabaseClient = useSupabaseClient();
  const queryClient = useQueryClient();

  const signOut = async () => {
    let { error } = await supabaseClient.auth.signOut();

    if (error) {
      throw new Error(error.message);
    }
  };

  return useMutation(() => signOut(), {
    onSuccess: () => {
      queryClient.clear();
    },
    onError: (error) => {
      console.log(error);
    },
  });
}
