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
import WithCafeAuth from "@components/WithCafeAuth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useState } from "react";
import { supabase } from "~lib/api";

const Edit = ({ data }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: menu, isLoading } = useQuery(["menu", router.query], getMenu, {
    initialData: data,
  });

  const [name, setName] = useState(menu.name || "");
  const [price, setPrice] = useState(menu.price || "");
  const [description, setDescription] = useState(menu.description || "");
  const [image, setImage] = useState(null);
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
    const { data: upload, error: uploadError } = await supabase.storage
      .from("food-app")
      .update(`menus/${name}.png`, image, {
        cacheControl: 1,
        upsert: true,
      });

    const { publicURL } = supabase.storage
      .from("food-app")
      .getPublicUrl(`menus/${name}.png`);
    return publicURL;
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
        queryClient.invalidateQueries("menu");
      },
    }
  );

  const onSave = async (e) => {
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
              type="text"
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
              onChange={(e) => setImage(e.target.files[0])}
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

export const getServerSideProps = async (ctx) => {
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
