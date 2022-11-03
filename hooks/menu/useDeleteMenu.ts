import { useToast } from "@chakra-ui/react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Database } from "~types/supabase";

export default function useDeleteMenu() {
  const supabaseClient = useSupabaseClient<Database>();
  const queryClient = useQueryClient();
  const toast = useToast();

  const deleteMenu = async ({ id, image }: { id: number; image: string }) => {
    const { data, error } = await supabaseClient
      .from("menu")
      .delete()
      .match({ id })
      .returns();

    if (error) {
      throw new Error(error.message);
    }

    // delete menu image from storage
    const pathArray = image.split("/");
    const path = pathArray.slice(pathArray.indexOf("menus")).join("/");
    const { error: deleteError } = await supabaseClient.storage
      .from("food-app")
      .remove([path]);

    if (deleteError) {
      throw new Error(deleteError.message);
    }

    return data;
  };

  return useMutation(
    (data: { id: number; image: string }) => deleteMenu(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["menus"]);
        toast({
          description: "Menu deleted",
          status: "success",
          duration: 4000,
          isClosable: true,
          position: "top-right",
        });
      },
      onError: () => {
        toast({
          description: "An error occurred",
          status: "error",
          duration: 4000,
          isClosable: true,
          position: "top-right",
        });
      },
    }
  );
}
