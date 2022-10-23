import { GetStaticProps } from "next";
import MenuDetails from "~components/Menu/MenuDetails";
import { supabase } from "~lib/api";
import { Menu } from "~types/types";

const Menu = ({ menu }: { menu: Menu }) => {
  return <MenuDetails menu={menu} />;
};
export const getStaticPaths = async () => {
  const { data: menus, error } = await supabase.from<Menu>("menu").select();

  const paths = menus?.map(({ id }) => ({
    params: { id: id.toString() },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  const menuId = ctx.params!.id as string;

  const { data: menu, error } = await supabase
    .from<Menu>("menu")
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
