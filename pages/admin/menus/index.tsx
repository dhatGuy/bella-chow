import { Box, Heading, Link, SimpleGrid, useToast } from "@chakra-ui/react";
import { withPageAuth } from "@supabase/auth-helpers-nextjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import NextLink from "next/link";
import MenuItem from "~components/dashboard/Menu/MenuItem";
import Spinner from "~components/Spinner";
import useProfile from "~hooks/auth/useProfile";
import { useMenus } from "~hooks/menu";
import { supabase } from "~lib/api";

const Menus = () => {
  const { data: user } = useProfile();
  const toast = useToast();
  const queryClient = useQueryClient();

  const { data: menus, isLoading } = useMenus();

  const mutation = useMutation(
    async (id) => {
      const { data, error } = await supabase
        .from("menu")
        .delete()
        .match({ id });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["menus"]);
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

  const onDelete = async (id: void) => {
    mutation.mutate(id);
  };

  if (isLoading) return <Spinner />;

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

      <NextLink href="/admin/menus/create" passHref>
        <Link>Add new product</Link>
      </NextLink>
      <SimpleGrid
        minChildWidth="250px"
        spacing="40px"
        justifyItems="center"
        mx={[null, "2"]}
      >
        {menus?.map((menu) => (
          <MenuItem onDelete={onDelete} menu={menu} key={menu.id} />
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default Menus;

export const getServerSideProps = withPageAuth({
  redirectTo: "/login",
  // getServerSideProps() {

  // }
});
