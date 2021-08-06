import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Heading,
  Link,
  SimpleGrid,
} from "@chakra-ui/react";
import MenuItem from "@components/dashboard/Menu/MenuItem";
import { useAuth } from "@context/AuthContext";
import { supabase } from "api";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useToast } from "@chakra-ui/react";
import NextLink from "next/link";
import WithCafeAuth from "@components/WithCafeAuth";

const Menus = () => {
  const { user } = useAuth();
  const toast = useToast();
  const queryClient = useQueryClient();

  const getMenus = async () => {
    const { data: menus, error } = await supabase
      .from("menu")
      .select()
      .eq("cafe_id", user?.cafe[0].id);
    return menus;
  };
  const { data: menus, isLoading } = useQuery(["menus", user], getMenus);

  const mutation = useMutation(
    async (id) => {
      const { data, error } = await supabase
        .from("menu")
        .delete()
        .match({ id });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("menus");
        toast({
          description: "Menu deleted",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      },
      onError: () => {
        toast({
          description: "An error occurred",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      },
    }
  );

  const onDelete = async (id) => {
    mutation.mutate(id);
  };

  if (isLoading || !user) {
    return <Box>Loading...</Box>;
  }
  return (
    <Box>
      {/* <Breadcrumb>
        <BreadcrumbItem>
          <NextLink href="/dashboard" passHref>
            <BreadcrumbLink as={Link}>Dashboard</BreadcrumbLink>
          </NextLink>
          </BreadcrumbItem>
        </Breadcrumb> */}
      <Heading as="h2" textAlign="center">
        Menus
      </Heading>

      <NextLink href="/dashboard/menus/create" passHref>
        <Link>Add new product</Link>
      </NextLink>
      <SimpleGrid
        minChildWidth="250px"
        spacing="40px"
        justifyItems="center"
        mx={[null, "2"]}
      >
        {menus.map((menu) => (
          <MenuItem onDelete={onDelete} menu={menu} key={menu.id} />
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default WithCafeAuth(Menus);
