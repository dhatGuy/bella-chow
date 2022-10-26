import { dehydrate, QueryClient } from "@tanstack/react-query";
import { GetStaticProps } from "next";
import { useRouter } from "next/router";
import CafeteriaDetails from "~components/Cafeterias/CafeteriaDetails";
import Spinner from "~components/Spinner";
import useGetCafe from "~hooks/cafe/useGetCafe";
import { supabase } from "~lib/api";
import { NextPageWithLayout } from "~pages/_app";

const Cafe: NextPageWithLayout = () => {
  const router = useRouter();
  const { data: cafe, isLoading } = useGetCafe(router.query.slug as string);

  if (isLoading) return <Spinner />;

  return <CafeteriaDetails cafe={cafe!} />;
};

export default Cafe;

export const getStaticPaths = async () => {
  const { data: cafeterias, error } = await supabase.from("cafeteria").select();
  console.log(cafeterias);

  const paths = cafeterias?.map(({ slug }) => ({
    params: {
      slug: slug.toString(),
    },
  }));

  return {
    paths,
    fallback: "blocking",
  };
};
export const getStaticProps: GetStaticProps = async (ctx) => {
  const queryClient = new QueryClient();
  const slug = ctx.params?.slug;

  const getCafeteria = async () => {
    const { data: cafeteria, error } = await supabase
      .from("cafeteria")
      .select(
        `*, 
      menuCategories:menu_category(*, menus:menu(*)), 
      menus:menu(*), 
      reviews:review(*)`
      )
      .eq("slug", slug as string)
      .single();

    return cafeteria;
  };

  await queryClient.prefetchQuery(["cafe", slug], getCafeteria);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 10,
  };
};
