import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FilePondFile } from "filepond";
import { useRouter } from "next/router";
import useProfile from "~hooks/auth/useProfile";
import { Menus } from "~types";
import { Database } from "~types/supabase";
import { slugify } from "~utils";

type CreateMenu = Omit<Menus, "id" | "image" | "cafe_id"> & {
  image: FilePondFile | undefined;
};

export default function useCreateMenu() {
  const supabase = useSupabaseClient<Database>();
  const queryClient = useQueryClient();
  const { data: user } = useProfile();
  const router = useRouter();

  const handleUpload = async (
    files: CreateMenu["image"],
    name: string,
    cafe_id: number
  ) => {
    if (!files || !files.file) throw new Error("Image upload failed");
    const fileExt = files.fileExtension;

    const { data, error } = await supabase.storage
      .from("food-app")
      .upload(`menus/${cafe_id}/${slugify(name)}.${fileExt}`, files.file);
    /**
     * save the image in a folder named after the cafe id
     */

    if (error) throw new Error(error.message);

    const {
      data: { publicUrl },
    } = supabase.storage
      .from("food-app")
      .getPublicUrl(`menus/${cafe_id}/${slugify(name)}.${fileExt}`);

    return publicUrl;
  };

  const createMenu = async (menu: CreateMenu) => {
    if (!user) throw new Error("You must be logged in to create a menu");

    let imgUrl = await handleUpload(menu.image, menu.name, user?.cafeteria.id);

    if (!imgUrl) throw new Error("Image upload failed");

    if (!user?.cafeteria) throw new Error("Cafeteria not found");

    // TODO: generate id to make it easier for deleting image
    const { data, error } = await supabase.from("menu").insert({
      ...menu,
      image: imgUrl,
      cafe_id: user.cafeteria.id,
    });

    if (error) {
      await supabase.storage
        .from("food-app")
        .remove([
          `menus/${user.cafeteria.id}/${slugify(menu.name)}.${
            menu.image?.fileExtension
          }`,
        ]);

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
