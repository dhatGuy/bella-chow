import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { createUser } from "~hooks/auth/useCreateUser";
import { slugify } from "~utils";

type Cafe = {
  cafeName: string;
  email: string;
  password: string;
  username: string;
  role: "CAFE_OWNER";
};

export default function useCreateCafe() {
  const supabaseClient = useSupabaseClient();
  const router = useRouter();

  const createCafe = async ({ cafeName, email, password, username }: Cafe) => {
    try {
      let { data: findBySlug } = await supabaseClient
        .from("cafeteria")
        .select("*")
        .eq("slug", slugify(cafeName))
        .maybeSingle();

      if (findBySlug) {
        throw new Error("Cafeteria already exists");
      }

      const user = await createUser(supabaseClient, {
        email,
        password,
        role: "CAFE_OWNER",
        username,
      });

      const { data, error } = await supabaseClient.from("cafeteria").insert({
        name: cafeName,
        owner_id: user?.id,
        slug: slugify(cafeName),
      });

      if (error) throw new Error(error.message);
      return data;
    } catch (error) {
      throw error;
    }
  };

  return useMutation((data: Cafe) => createCafe(data), {
    onSuccess() {
      router.push("/admin");
    },
    onError(error) {
      console.log("error", error);
    },
  });
}
