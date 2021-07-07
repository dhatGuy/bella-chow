import { Heading, Text } from "@chakra-ui/react";
import { supabase } from "../../api";

const Cafeterias = ({ cafeterias }) => {
  console.log(cafeterias);
  return (
    <div>
      <Heading>Cafes</Heading>
      {cafeterias.map((cafe) => (
        <Text key={cafe.id}>{cafe.name}</Text>
      ))}
    </div>
  );
};
export const getStaticProps = async (ctx) => {
  const { data, error } = await supabase.from("cafeterias");
  return {
    props: {
      cafeterias: data,
    },
  };
};

export default Cafeterias;
