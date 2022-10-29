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
  VStack,
} from "@chakra-ui/react";
import { withPageAuth } from "@supabase/auth-helpers-nextjs";
import { FilePondFile } from "filepond";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import "filepond/dist/filepond.min.css";
import { useState } from "react";
import { FilePond, registerPlugin } from "react-filepond";
import { useForm } from "react-hook-form";
import useProfile from "~hooks/auth/useProfile";
import useGetCafe from "~hooks/cafe/useGetCafe";
import { useCreateMenu } from "~hooks/menu";

// Register the plugins
registerPlugin(
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview,
  FilePondPluginFileValidateType
);

interface FormValues {
  name: string;
  description: string;
  price: number;
  available: boolean;
  categoryId: number;
}

const Create = () => {
  const createMenu = useCreateMenu();
  const [files, setFiles] = useState<FilePondFile[] | undefined>();
  const { data: user } = useProfile();
  const { data: cafe } = useGetCafe(user?.cafeteria.slug);
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      available: true,
    },
  });

  const onCreate = handleSubmit((formData) => {
    createMenu.mutate({
      ...formData,
      image: files,
    });
  });

  return (
    <Box pl="2">
      <Heading as="h1">Create Menu</Heading>
      <form onSubmit={onCreate}>
        <VStack align={"flex-start"}>
          <FormControl id="name" isInvalid={!!errors.name}>
            <FormLabel>Product name</FormLabel>
            <Input
              type="text"
              w={["100%", "50%"]}
              {...register("name", {
                required: "Menu name is required",
                minLength: {
                  value: 3,
                  message: "Menu name must be at least 3 characters",
                },
                maxLength: {
                  value: 20,
                  message: "Menu name must be at most 20 characters",
                },
              })}
            />
            <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
          </FormControl>
          <FormControl id="category" isInvalid={!!errors.description}>
            <FormLabel>Menu Category</FormLabel>
            <Select
              placeholder="Select option"
              w={["100%", "50%"]}
              {...register("categoryId", {
                required: "Menu category is required",
              })}
            >
              {cafe?.menuCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name.charAt(0).toUpperCase() +
                    category.name.slice(1)}
                </option>
              ))}
            </Select>
            <FormErrorMessage>{errors.categoryId?.message}</FormErrorMessage>
          </FormControl>
          <FormControl id="description" isInvalid={!!errors.description}>
            <FormLabel>Menu description</FormLabel>
            <Input
              type="text"
              w={["100%", "50%"]}
              {...register("description", {
                required: "Description is required",
              })}
            />
            <FormErrorMessage>{errors.description?.message}</FormErrorMessage>
          </FormControl>
          <FormControl id="price" isInvalid={!!errors.price}>
            <FormLabel>Product price</FormLabel>
            <Input
              type="number"
              w={["100%", "50%"]}
              {...register("price", {
                required: "Price is required",
                min: {
                  value: 200,
                  message: "Price must be at least 200",
                },
              })}
            />
            <FormErrorMessage>{errors.price?.message}</FormErrorMessage>
          </FormControl>
          <FormControl id="image">
            <FilePond
              // @ts-ignore
              files={files}
              onupdatefiles={setFiles}
              acceptedFileTypes={[
                "image/png",
                "image/jpeg",
                "image/jpg",
                "image/gif, image/svg, image/webp",
              ]}
              allowMultiple={false}
              maxFiles={1}
              required
              name="files"
              labelIdle='Drag & Drop the menu image or <span class="filepond--label-action">Browse</span>'
            />
          </FormControl>
          <FormControl
            display="flex"
            alignItems="center"
            id="isAvailable"
            isInvalid={!!errors.available}
          >
            <FormLabel htmlFor="available" mb="0">
              Menu available?
            </FormLabel>
            <Switch id="available" {...register("available")} />
          </FormControl>
          <Button
            type="submit"
            isLoading={createMenu.isLoading}
            loadingText="Saving..."
          >
            Save
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default Create;

export const getServerSideProps = withPageAuth({
  redirectTo: "/login",
});
