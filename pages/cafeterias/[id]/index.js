import CafeteriaDetails from "@components/Cafeterias/CafeteriaDetails";
import { supabase } from "api";
const Cafe = ({ cafeteria }) => {
  return (
    <div>
      <CafeteriaDetails cafe={cafeteria} />
    </div>
  );
};

export default Cafe;

export const getStaticPaths = async () => {
  const { data: cafeterias, error } = await supabase
    .from("cafeterias")
    .select();
  const paths = cafeterias.map(({ id }) => ({
    params: {
      id: id.toString(),
    },
  }));

  return {
    paths,
    fallback: "blocking",
  };
};
export const getStaticProps = async (ctx) => {
  const cafeId = ctx.params.id;
  const { data: cafeteria, error } = await supabase
    .from("cafeterias")
    .select("*, menu(*), reviews(*)")
    .eq("id", cafeId)
    .single();

  return {
    props: {
      cafeteria,
    },
  };
};
