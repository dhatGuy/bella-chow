import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Select,
  Switch,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { withPageAuth } from "@supabase/auth-helpers-nextjs";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import { FilePondFile, FilePondInitialFile } from "filepond";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import "filepond/dist/filepond.min.css";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { FilePond, registerPlugin } from "react-filepond";
import { Controller, useForm } from "react-hook-form";
import Spinner from "~components/Spinner";
import useProfile from "~hooks/auth/useProfile";
import useGetCafe from "~hooks/cafe/useGetCafe";
import { useEditMenu, useMenu } from "~hooks/menu";
import { supabase } from "~lib/api";
import { Menus } from "~types";

registerPlugin(
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview,
  FilePondPluginFileValidateType
);

type FormValues = Omit<Menus, "id" | "cafe_id" | "image"> & {
  imageFile: (FilePondFile | FilePondInitialFile)[];
};

const Edit = () => {
  const router = useRouter();
  const { data: user } = useProfile();
  const { data: menu, isLoading } = useMenu(Number(router.query.id));
  const { data: cafe, isLoading: cafeLoading } = useGetCafe(
    user?.cafeteria.slug
  );
  const editMenu = useEditMenu(Number(router.query.id));

  const {
    handleSubmit,
    register,
    control,
    formState: { errors, isDirty, dirtyFields },
    watch,
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      imageFile: [
        {
          source: menu?.image,
          options: { type: "local" },
        },
      ],
    },
  });

  useEffect(() => {
    if (cafe && menu) {
      reset({
        available: menu.available,
        description: menu.description,
        price: menu.price,
        name: menu.name,
        category_id: menu.category_id,
        imageFile: [
          {
            source: menu.image,
            options: { type: "local" },
          },
        ],
      });
    }
  }, [cafe, menu, reset]);

  if (!menu || !cafe) {
    return <Spinner />;
  }

  const onSave = handleSubmit((values) => {
    console.log(dirtyFields);
    editMenu.mutate({
      ...values,
      imageFile: watch("imageFile")[0] as FilePondFile,
      imgUrl: menu.image,
    });
  });

  // TODO: disable submit btn if there is no change in the form

  return (
    <Box pl="2">
      <Heading as="h1">Edit Menu</Heading>
      <form onSubmit={onSave}>
        <VStack>
          <FormControl id="name" isInvalid={!!errors.name}>
            <FormLabel>Menu name</FormLabel>
            <Input
              w={["100%", "50%"]}
              type="text"
              {...register("name", {
                required: "Menu name is required",
              })}
            />
            <FormErrorMessage>
              {errors.name && errors.name.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl id="description" isInvalid={!!errors.description}>
            <FormLabel>Menu description</FormLabel>
            <Textarea
              w={["100%", "50%"]}
              defaultValue={menu?.description || ""}
              {...register("description", {
                required: "Menu description is required",
              })}
            />
            <FormErrorMessage>
              {errors.description && errors.description.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl id="price" isInvalid={!!errors.price}>
            <FormLabel>Product price</FormLabel>
            <Input
              w={["100%", "50%"]}
              type="number"
              {...register("price", {
                required: "Menu price is required",
              })}
            />
          </FormControl>
          <FormControl id="category" isInvalid={!!errors.category_id}>
            <FormLabel>Menu Category</FormLabel>
            <Select
              placeholder="Select menu category"
              w={["100%", "50%"]}
              {...register("category_id", {
                required: "Menu category is required",
              })}
            >
              {cafe?.menuCategories.map((category) => (
                <option key={category.id} value={category.id.toString()}>
                  {category.name.charAt(0).toUpperCase() +
                    category.name.slice(1)}
                </option>
              ))}
            </Select>
            <FormErrorMessage>{errors.category_id?.message}</FormErrorMessage>
          </FormControl>
          <Controller
            name="imageFile"
            control={control}
            rules={{ required: "Menu image is required" }}
            render={({ field: { onChange, value } }) => (
              <FormControl id="image" isInvalid={!!errors.imageFile}>
                <FilePond
                  acceptedFileTypes={[
                    "image/png",
                    "image/jpeg",
                    "image/jpg",
                    "image/gif, image/svg, image/webp",
                  ]}
                  // @ts-ignore
                  files={value}
                  allowMultiple={false}
                  onupdatefiles={onChange}
                  server={{
                    async load(source, load, error, progress) {
                      const request = new Request(source);
                      try {
                        const blob = await (await fetch(request)).blob();
                        progress(true, 100, 100);

                        load(blob);
                      } catch (e) {
                        error("could not load image");
                      }
                    },
                  }}
                  labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
                />
                <FormErrorMessage>{errors.imageFile?.message}</FormErrorMessage>
              </FormControl>
            )}
          />
          <FormControl display="flex" alignItems="center" id="available">
            <FormLabel mb="0">Available</FormLabel>
            <Switch
              id="available"
              {...register("available", {
                required: "Menu availability is required",
              })}
            />
          </FormControl>
          <FormControl>
            <Button
              type="submit"
              isLoading={editMenu.isLoading}
              isDisabled={!isDirty}
              loadingText="Saving..."
            >
              Save
            </Button>
          </FormControl>
        </VStack>
      </form>
    </Box>
  );
};

export default Edit;

export const getServerSideProps: GetServerSideProps = withPageAuth({
  redirectTo: "/login",
  getServerSideProps: async (ctx) => {
    const queryClient = new QueryClient();

    const getCafe = async () => {
      const { data, error } = await supabase
        .from("menu")
        .select()
        .eq("id", ctx.query.id)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    };
    await queryClient.prefetchQuery(["cafe", ctx.query.id], getCafe);

    return {
      props: {
        dehydratedState: dehydrate(queryClient),
      },
    };
  },
});
