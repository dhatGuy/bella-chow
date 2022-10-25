import { useToast } from "@chakra-ui/react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useMutation } from "@tanstack/react-query";
import Router from "next/router";

export default function useUpdatePassword() {
  const toast = useToast();
  const supabaseClient = useSupabaseClient();
  const updatePassword = async (password: string) => {
    const { data: user, error } = await supabaseClient.auth.updateUser({
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    return user;
  };

  return useMutation((password: string) => updatePassword(password), {
    onSuccess: () => {
      toast({
        position: "top-right",
        title: "Password Reset",
        description: "Password reset successful",
        status: "success",
        duration: 4000,
      });
      Router.push("/");
    },
  });
}
