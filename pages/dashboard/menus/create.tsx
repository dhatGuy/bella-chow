import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Image,
  Input,
  Switch,
  VStack,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useState } from "react";
import WithCafeAuth from "~components/WithCafeAuth";
import { useAuth } from "~context/AuthContext";
import { supabase } from "~lib/api";

const Create = () => {
  const { user } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [available, setAvailable] = useState(false);

  // upload image
  const handleUpload = async () => {
    const fileExt = image.name.split(".").pop();

    const { data, error } = await supabase.storage
      .from("food-app")
      .upload(`menus/${name}.${fileExt}`, image);

    const { publicURL } = supabase.storage
      .from("food-app")
      .getPublicUrl(`menus/${name}.${fileExt}`);
    return publicURL;
  };
  const mutation = useMutation(
    async () => {
      let imgUrl = await handleUpload();

      const { data, error } = await supabase.from("menu").insert({
        name,
        description,
        image: imgUrl,
        price,
        available,
        cafe_id: user.cafe[0].id,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("menu");
        router.push("/dashboard/menus");
      },
    }
  );

  const onCreate = async (e) => {
    e.preventDefault();
    if (!name || !description || !price || !image) {
      return alert("All fields required");
    }
    mutation.mutate();
  };
  return (
    <Box pl="2">
      <Heading as="h1">Create Menu</Heading>
      <form onSubmit={onCreate}>
        <VStack>
          <FormControl>
            <FormLabel>Product name</FormLabel>
            <Input
              type="text"
              w={["100%", "50%"]}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Product description</FormLabel>
            <Input
              type="text"
              w={["100%", "50%"]}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Product price</FormLabel>
            <Input
              type="number"
              w={["100%", "50%"]}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </FormControl>
          <Box w="100%">
            <Image
              src={image && `${URL.createObjectURL(image)}`}
              fallbackSrc="https://via.placeholder.com/150"
              w="36"
              h="36"
              alt={name}
            />
          </Box>
          <FormControl>
            <FormLabel>Product image</FormLabel>
            <Input
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

export default WithCafeAuth(Create);
