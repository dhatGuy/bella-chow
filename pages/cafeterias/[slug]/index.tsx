import CafeteriaDetails from "~components/Cafeterias/CafeteriaDetails";
import { supabase } from "~lib/api";
import { Cafeteria, CafeteriaWithMenuAndReviews } from "~types/types";

interface CafeProps {
  cafeteria: CafeteriaWithMenuAndReviews;
}

const Cafe = ({ cafeteria }: CafeProps) => {
  return (
    <div>
      <CafeteriaDetails cafe={cafeteria} />
    </div>
  );
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
export const getStaticProps = async (ctx) => {
  const slug = ctx.params.slug;
  const { data: cafeteria, error } = await supabase
    .from<CafeteriaWithMenuAndReviews>("cafeteria")
    .select("*, menus:menu(*), reviews:review(*)")
    .eq("slug", slug)
    .single();

  return {
    props: {
      cafeteria,
    },
    revalidate: 10,
  };
};
