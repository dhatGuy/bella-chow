import { Heading, Text } from "@chakra-ui/react";
import { supabase } from "../../api";
import CafeteriaList from "../../components/Cafeterias/CafeteriaList";
const Cafeterias = ({ cafeterias }) => {
  return (
    <div>
      <Heading>Cafes</Heading>
      <CafeteriaList cafes={cafeterias} />
    </div>
  );
};
export const getStaticProps = async (ctx) => {
  const { data, error } = await supabase.from("cafeterias");
  // console.log(data || error);
  return {
    props: {
      cafeterias: data,
    },
  };
};

export default Cafeterias;
