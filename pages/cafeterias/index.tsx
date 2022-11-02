import { Box, Heading, Stack } from "@chakra-ui/react";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import Cafeteria from "~components/Cafeterias/Cafeteria";
import useGetCafes from "~hooks/cafe/useGetCafes";
import { supabase } from "~lib/api";
import { CafeteriaWithReviews } from "~types";

const Cafeterias = () => {
  const { data: cafeterias } = useGetCafes();
  return (
    <Box>
      <Heading textAlign="center" my={4}>
        Cafeterias
      </Heading>
      <Stack
        spacing={"5"}
        width={["100%", "100%", "100%", "50%"]}
        justify="center"
        m="auto"
      >
        {cafeterias?.map((cafe) => (
          <Cafeteria key={cafe.id} cafe={cafe as CafeteriaWithReviews} />
        ))}
      </Stack>
    </Box>
  );
};

export const getStaticProps = async () => {
  const queryClient = new QueryClient();
  const getCafeterias = async () => {
    const { data } = await supabase
      .from("cafeteria")
      .select(`*, reviews:review(*)`);

    return data;
  };

  await queryClient.prefetchQuery(["cafes"], getCafeterias);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 10,
  };
};

export default Cafeterias;
