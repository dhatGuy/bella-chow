import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FilePondFile } from "filepond";
import { useRouter } from "next/router";
import useProfile from "~hooks/auth/useProfile";
import { Menus } from "~types";
import { Database } from "~types/supabase";

type CreateMenu = Omit<Menus, "id" | "image" | "cafe_id"> & {
  image: FilePondFile | undefined;
};

export default function useCreateMenu() {
  const supabase = useSupabaseClient<Database>();
  const queryClient = useQueryClient();
  const { data: user } = useProfile();
  const router = useRouter();

  const handleUpload = async (files: CreateMenu["image"], name: string) => {
    if (!files) throw new Error("Image upload failed");
    const fileExt = files.fileExtension;

    const { data, error } = await supabase.storage
      .from("food-app")
      .upload(`menus/${name}.${fileExt}`, files.file); // create folder for each cafe

    if (error) throw new Error(error.message);

    const {
      data: { publicUrl },
    } = supabase.storage
      .from("food-app")
      .getPublicUrl(`menus/${name}.${fileExt}`);

    return publicUrl;
  };

  const createMenu = async (menu: CreateMenu) => {
    // TODO: generate id to make it easier for deleting image
    let imgUrl = await handleUpload(menu.image, menu.name);

    if (!imgUrl) throw new Error("Image upload failed");

    if (!user?.cafeteria) throw new Error("Cafeteria not found");

    const { data, error } = await supabase.from("menu").insert({
      ...menu,
      image: imgUrl,
      cafe_id: user?.cafeteria.id,
    });

    if (error) {
      await supabase.storage
        .from("food-app")
        .remove([`menus/${menu.name}.${menu.image?.fileExtension}`]);

      throw new Error(error.message);
    }

    return data;
  };

  return useMutation((menu: CreateMenu) => createMenu(menu), {
    onSuccess: () => {
      queryClient.invalidateQueries(["menus"]);
      router.push("/admin/menus");
    },
  });
}
