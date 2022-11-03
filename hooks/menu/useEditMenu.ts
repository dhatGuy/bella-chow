import { useToast } from "@chakra-ui/react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FilePondFile } from "filepond";
import { useRouter } from "next/router";
import useProfile from "~hooks/auth/useProfile";
import { Menus } from "~types";
import { Database } from "~types/supabase";
import { slugify } from "~utils";

type EditMenu = Omit<Menus, "id" | "image" | "cafe_id"> & {
  imageFile: FilePondFile;
  imgUrl: string;
  imageChanged: boolean | undefined;
  nameChanged: boolean | undefined;
};

export default function useEditMenu(id?: number) {
  const supabase = useSupabaseClient<Database>();
  const queryClient = useQueryClient();
  const { data: user } = useProfile();
  const router = useRouter();
  const toast = useToast();

  const handleUpdate = async (
    imageFile: EditMenu["imageFile"],
    imgUrl: string,
    nameChanged: boolean | undefined,
    imageChanged: boolean | undefined,
    menuName: string
  ) => {
    const urlArray = imgUrl.split("/");
    const path = urlArray.slice(urlArray.indexOf("menus")).join("/");

    if (imageChanged) {
      const { error: uploadError } = await supabase.storage
        .from("food-app")
        .update(`${path}`, imageFile.file, {
          upsert: true,
          cacheControl: "1800",
        });

      if (uploadError) throw new Error(uploadError.message);
    }

    // rename file if name changed
    if (nameChanged) {
      const { error: renameError } = await supabase.storage
        .from("food-app")
        .move(
          `${path}`,
          `menus/${user?.cafeteria.id}/${slugify(menuName)}.${path
            .split(".")
            .pop()}`
        );

      if (renameError) throw new Error(renameError.message);
    }

    const {
      data: { publicUrl },
    } = supabase.storage
      .from("food-app")
      .getPublicUrl(
        `menus/${user?.cafeteria.id}/${slugify(menuName)}.${path
          .split(".")
          .pop()}`
      );

    console.log(publicUrl);

    return publicUrl;
  };

  const editMenu = async (menu: EditMenu) => {
    const image = await handleUpdate(
      menu.imageFile,
      menu.imgUrl,
      menu.nameChanged,
      menu.imageChanged,
      menu.name
    );

    if (!user?.cafeteria) throw new Error("Cafeteria not found");

    const { imageFile, imgUrl, imageChanged, nameChanged, ...data } = menu;
    const { data: res, error } = await supabase
      .from("menu")
      .update({
        ...data,
        image,
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
      toast({
        status: "success",
        description: "Menu updated successfully",
        duration: 5000,
        isClosable: true,
      });
    },
    onError: () => {
      toast({
        status: "error",
        description: "An error occurred while updating the menu",
        duration: 5000,
        isClosable: true,
      });
    },
  });
}
