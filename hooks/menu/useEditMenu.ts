import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FilePondFile } from "filepond";
import { useRouter } from "next/router";
import useProfile from "~hooks/auth/useProfile";
import { Menus } from "~types";
import { Database } from "~types/supabase";

type EditMenu = Omit<Menus, "id" | "image" | "cafe_id"> & {
  imageFile: FilePondFile;
  imgUrl: string;
};

export default function useEditMenu(id?: number) {
  const supabase = useSupabaseClient<Database>();
  const queryClient = useQueryClient();
  const { data: user } = useProfile();
  const router = useRouter();

  const handleUpdate = async (
    imageFile: EditMenu["imageFile"],
    imgUrl: string
  ) => {
    const urlArray = imgUrl.split("/");
    const path = urlArray.slice(urlArray.indexOf("menus")).join("/");

    const { error: uploadError } = await supabase.storage
      .from("food-app")
      .update(`${path}`, imageFile.file, {
        upsert: true,
        cacheControl: "1800",
      });

    if (uploadError) throw new Error(uploadError.message);

    const {
      data: { publicUrl },
    } = supabase.storage.from("food-app").getPublicUrl(`${path}`);

    return publicUrl;
  };

  const editMenu = async (menu: EditMenu) => {
    // TODO: check if there is a new image

    const image = await handleUpdate(menu.imageFile, menu.imgUrl);

    if (!image) throw new Error("Image upload failed");

    if (!user?.cafeteria) throw new Error("Cafeteria not found");
    const { imageFile, imgUrl, ...data } = menu;
    const { data: res, error } = await supabase
      .from("menu")
      .update({
        ...data,
      })
      .match({ id });

    if (error) {
      throw new Error(error.message);
    }

    return res;
  };

  return useMutation((menu: EditMenu) => editMenu(menu), {
    onSuccess: () => {
      queryClient.invalidateQueries(["menu", id]);
      router.push("/admin/menus");
    },
  });
}
