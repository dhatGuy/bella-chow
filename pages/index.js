import Head from "next/head";
import Image from "next/image";
import { supabase } from "../api";
import { SimpleGrid, Container } from "@chakra-ui/react";
import MenuItem from "../components/MenuItem";
import NavBar from "../components/NavBar";
import MenuList from "../components/MenuList";

export default function Home({ menus }) {
  return (
    <Container maxW="container.xl" my="10">
      <MenuList menus={menus} />
    </Container>
  );
}

export const getStaticProps = async (ctx) => {
  const { data, error } = await supabase.from("menu").select();
  return {
    props: {
      menus: data,
      // validate: 1,
    },
  };
};
