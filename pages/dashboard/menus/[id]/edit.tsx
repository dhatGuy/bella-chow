import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Image,
  Input,
  Switch,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import WithCafeAuth from "~components/WithCafeAuth";
import { supabase } from "~lib/api";
import { Menu } from "~types";

const Edit = (data: Menu) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: menu, isLoading } = useQuery(["menu", router.query], getMenu, {
    initialData: data,
  });

  const [name, setName] = useState(menu.name || "");
  const [price, setPrice] = useState(menu.price || "");
  const [description, setDescription] = useState(menu.description || "");
  const [image, setImage] = useState<File>();
  const [available, setAvailable] = useState(menu.available || false);

  async function getMenu() {
    const { data, error } = await supabase
      .from("menu")
      .select()
      .eq("id", router.query.id)
      .single();
    return data;
  }
  // upload image
  const handleUpload = async () => {
    if (!image) {
      return;
    }

    const { data: upload, error: uploadError } = await supabase.storage
      .from("food-app")
      .update(`menus/${name}.png`, image, {
        upsert: true,
        cacheControl: "1800",
      });

    const { data } = supabase.storage
      .from("food-app")
      .getPublicUrl(`menus/${name}.png`);
    return data.publicUrl;
  };
  const mutation = useMutation(
    async () => {
      let imgUrl;
      if (image) {
        imgUrl = await handleUpload();
      }
      const { data, error } = await supabase
        .from("menu")
        .update({ name, description, image: imgUrl, price, available })
        .match({ id: router.query.id });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["menu"]);
      },
    }
  );

  const onSave = async (e: FormEvent) => {
    e.preventDefault();
    mutation.mutate();
  };
  if (isLoading) {
    return <Box>Loading...</Box>;
  }
  return (
    <Box pl="2">
      <Heading as="h1">Edit Menu</Heading>
      <form onSubmit={onSave}>
        <VStack>
          <FormControl>
            <FormLabel>Product name</FormLabel>
            <Input
              w={["100%", "50%"]}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Product description</FormLabel>
            <Textarea
              w={["100%", "50%"]}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Product price</FormLabel>
            <Input
              w={["100%", "50%"]}
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </FormControl>
          <Box w="100%">
            <Image src={menu.image} w="36" h="36" alt={name} />
          </Box>
          <FormControl>
            <FormLabel>product image</FormLabel>
            <Input
              w={["100%", "50%"]}
              type="file"
              accept=".png, .jpg, .jpeg"
              onChange={(e) => {
                if (e.target.files) setImage(e.target.files[0]);
              }}
            />
          </FormControl>
          <FormControl display="flex" alignItems="center">
            <FormLabel htmlFor="available" mb="0">
              Available
            </FormLabel>
            <Switch
              id="available"
              isChecked={available}
              onChange={() => setAvailable(!available)}
            />
          </FormControl>
          <FormControl>
            <Button
              type="submit"
              isLoading={mutation.isLoading}
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

export default WithCafeAuth(Edit);

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { data, error } = await supabase
    .from("menu")
    .select()
    .eq("id", ctx.query.id)
    .single();

  return {
    props: {
      data,
    },
  };
};
