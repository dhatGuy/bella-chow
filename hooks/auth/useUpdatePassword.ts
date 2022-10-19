import { useToast } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import Router from "next/router";
import { supabase } from "~lib/api";

const updatePassword = async (password: string) => {
  const { user, error } = await supabase.auth.update({
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  return user;
};

export default function useUpdatePassword() {
  const toast = useToast();

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
