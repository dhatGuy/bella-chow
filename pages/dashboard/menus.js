import { Box, Button } from "@chakra-ui/react";
import MenuList from "@components/Menu/MenuList";
import { useAuth } from "@context/AuthContext";
import { supabase } from "api";
import { useQuery } from "react-query";

const Menus = () => {
  const { user } = useAuth();
  const getMenus = async () => {
    const { data: menus, error } = await supabase
      .from("menu")
      .select()
      .eq("cafe_id", user?.cafe[0].id);
    return menus;
  };
  const { data: menus, isLoading } = useQuery(["menus", user], getMenus);

  if (isLoading || !user) {
    return <Box>Loading...</Box>;
  }
  return (
    <Box
      colSpan={{
        base: 3,
        lg: 2,
      }}
      display="flex"
      flexDirection="column"
      justifyContent="center"
    >
      <MenuList menus={menus} />
    </Box>
  );
};

export default Menus;
