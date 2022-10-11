import { useMutation } from "@tanstack/react-query";
import { supabase } from "~lib/api";

const forgotPassword = async (email: string) => {
  const { data, error } = await supabase.auth.api.resetPasswordForEmail(email, {
    redirectTo: "https://food-ordering-app-bice.vercel.app/password-recovery",
  });

  if (error) {
    throw error;
  }

  console.log(data);

  return data;
};

export default function useResetPassword() {
  return useMutation(({ email }: { email: string }) => forgotPassword(email));
}
