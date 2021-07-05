import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import { supabase } from "../api";
import { SimpleGrid } from "@chakra-ui/react";
import MenuItem from "../components/MenuItem";
import NavBar from "../components/NavBar";

export default function Home({ menus }) {
  return (
    <div>
      <NavBar />
      <SimpleGrid minChildWidth="250px" spacing="40px">
        {menus
          ? menus.map((menu) => <MenuItem key={menu.id} menu={menu} />)
          : null}
      </SimpleGrid>
    </div>
  );
}

export const getStaticProps = async (ctx) => {
  const { data, error } = await supabase.from("menu").select();
  return {
    props: {
      menus: data,
    },
  };
};
