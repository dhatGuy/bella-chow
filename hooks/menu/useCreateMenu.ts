import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FilePondFile } from "filepond";
import { useRouter } from "next/router";
import useProfile from "~hooks/auth/useProfile";
import { Database } from "~types/supabase";

interface CreateMenu {
  name: string;
  description: string;
  price: number;
  available: boolean;
  categoryId: number;
  image: FilePondFile[] | undefined;
}

export default function useCreateMenu() {
  const supabase = useSupabaseClient<Database>();
  const queryClient = useQueryClient();
  const { data: user } = useProfile();
  const router = useRouter();

  const handleUpload = async (files: CreateMenu["image"], name: string) => {
    if (!files) return;
    const fileExt = files[0].fileExtension;

    const { data, error } = await supabase.storage
      .from("food-app")
      .upload(`menus/${name}.${fileExt}`, files[0].file);

    if (error) throw new Error(error.message);

    const {
      data: { publicUrl },
    } = supabase.storage
      .from("food-app")
      .getPublicUrl(`menus/${name}.${fileExt}`);

    return publicUrl;
  };

  const createMenu = async (data: CreateMenu) => {
    let imgUrl = await handleUpload(data.image, data.name);

    if (!imgUrl) throw new Error("Image upload failed");

    if (!user?.cafeteria) throw new Error("Cafeteria not found");

    const { data: res, error } = await supabase.from("menu").insert({
      ...data,
      image: imgUrl,
      cafe_id: user?.cafeteria.id,
      category_id: data.categoryId,
    });

    if (error) {
      throw new Error(error.message);
    }

    return res;
  };

  return useMutation((data: CreateMenu) => createMenu(data), {
    onSuccess: () => {
      queryClient.invalidateQueries(["menus"]);
      router.push("/admin/menus");
    },
  });
}
