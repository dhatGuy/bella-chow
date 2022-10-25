import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useMutation } from "@tanstack/react-query";

export default function useResetPassword() {
  const supabaseClient = useSupabaseClient();
  const forgotPassword = async (email: string) => {
    const { data, error } = await supabaseClient.auth.resetPasswordForEmail(
      email,
      {
        redirectTo:
          "https://food-ordering-app-bice.vercel.app/password-recovery",
      }
    );

    if (error) {
      throw new Error(error.message);
    }

    return data;
  };

  return useMutation(({ email }: { email: string }) => forgotPassword(email));
}
