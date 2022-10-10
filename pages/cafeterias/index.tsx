import { Box, Heading } from "@chakra-ui/react";
import { supabase } from "~lib/api";
import CafeteriaList from "../../components/Cafeterias/CafeteriaList";
const Cafeterias = ({ cafeterias }) => {
  return (
    <Box>
      <Heading textAlign="center" my={4}>
        Cafeterias
      </Heading>
      <CafeteriaList cafes={cafeterias} />
    </Box>
  );
};
export const getStaticProps = async (ctx) => {
  const { data, error } = await supabase
    .from("cafeterias")
    .select("*, reviews(*)");
  return {
    props: {
      cafeterias: data,
    },
    revalidate: 10,
  };
};

export default Cafeterias;
