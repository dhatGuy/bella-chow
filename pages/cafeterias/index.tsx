import { Box, Heading } from "@chakra-ui/react";
import CafeteriaList from "~components/Cafeterias/CafeteriaList";
import { supabase } from "~lib/api";
import { CafeteriaWithReviews } from "~types/types";

interface CafeteriasProps {
  cafeterias: CafeteriaWithReviews[];
}

const Cafeterias = ({ cafeterias }: CafeteriasProps) => {
  return (
    <Box>
      <Heading textAlign="center" my={4}>
        Cafeterias
      </Heading>
      <CafeteriaList cafes={cafeterias} />
    </Box>
  );
};
export const getStaticProps = async () => {
  const { data } = await supabase
    .from<CafeteriaWithReviews>("cafeteria")
    .select(`*, reviews:review(*)`);

  return {
    props: {
      cafeterias: data || [],
    },
    revalidate: 10,
  };
};

export default Cafeterias;
