import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";

export default function useLogout() {
  const supabaseClient = useSupabaseClient();
  const queryClient = useQueryClient();
  const router = useRouter();

  const signOut = async () => {
    let { error } = await supabaseClient.auth.signOut();

    if (error) {
      throw new Error(error.message);
    }
  };

  return useMutation(() => signOut(), {
    onSuccess: () => {
      router.push("/");
      queryClient.removeQueries();
    },
    onError: (error) => {
      console.log(error);
    },
  });
}
