import { Box, Heading, Link, SimpleGrid } from "@chakra-ui/react";
import { withPageAuth } from "@supabase/auth-helpers-nextjs";
import NextLink from "next/link";
import MenuItem from "~components/dashboard/Menu/MenuItem";
import Spinner from "~components/Spinner";
import { useMenus } from "~hooks/menu";

const Menus = () => {
  const { data: menus, isLoading } = useMenus();

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
          <MenuItem menu={menu} key={menu.id} />
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
