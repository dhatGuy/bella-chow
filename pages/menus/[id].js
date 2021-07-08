import { supabase } from "api";
import MenuDetails from "@components/MenuDetails";

const Menu = ({ menu }) => {
  return <MenuDetails menu={menu} />;
};
export const getStaticPaths = async () => {
  const { data: menus, error } = await supabase.from("menu").select();
  const paths = menus.map(({ id }) => ({
    params: { id: id.toString() },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async (ctx) => {
  const menuId = ctx.params.id;

  const { data: menu, error } = await supabase
    .from("menu")
    .select()
    .eq("id", menuId)
    .single();

  return {
    props: {
      menu,
    },
  };
};

export default Menu;
