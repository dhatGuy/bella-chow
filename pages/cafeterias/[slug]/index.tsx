import { GetStaticProps } from "next";
import { useRouter } from "next/router";
import CafeteriaDetails from "~components/Cafeterias/CafeteriaDetails";
import Spinner from "~components/Spinner";
import useGetCafe from "~hooks/cafe/useGetCafe";
import { supabase } from "~lib/api";
import { NextPageWithLayout } from "~pages/_app";
import { Cafeteria, CafeteriaWithMenuAndReviews } from "~types/types";

interface CafeProps {
  cafeteria: CafeteriaWithMenuAndReviews;
}

const Cafe: NextPageWithLayout<CafeProps> = ({ cafeteria }) => {
  const router = useRouter();
  const { data: cafe, isLoading } = useGetCafe(
    router.query.slug as string,
    cafeteria
  );

  if (isLoading) return <Spinner />;

  return <CafeteriaDetails cafe={cafe!} />;
};

export default Cafe;

export const getStaticPaths = async () => {
  const { data: cafeterias, error } = await supabase
    .from<Cafeteria>("cafeteria")
    .select();

  const paths = cafeterias?.map(({ slug }) => ({
    params: {
      slug: slug!.toString(),
    },
  }));

  return {
    paths,
    fallback: "blocking",
  };
};
export const getStaticProps: GetStaticProps = async (ctx) => {
  const slug = ctx.params?.slug;
  const { data: cafeteria, error } = await supabase
    .from<CafeteriaWithMenuAndReviews>("cafeteria")
    .select(
      `*, 
      menuCategories:menu_category(*, menus:menu(*)), 
      menus:menu(*), 
      reviews:review(*)`
    )
    .eq("slug", slug as string)
    .single();

  return {
    props: {
      cafeteria,
    },
    revalidate: 10,
  };
};
