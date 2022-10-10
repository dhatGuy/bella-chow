import Cafeteria from "./Cafeteria";
import { VStack, Stack } from "@chakra-ui/react";

const CafeteriaList = ({ cafes }) => {
  return (
    <Stack
      spacing={"5"}
      width={["100%", "100%", "100%", "50%"]}
      justify="center"
      m="auto"
    >
      {cafes.map((cafe) => (
        <Cafeteria key={cafe.id} cafe={cafe} />
      ))}
    </Stack>
  );
};

export default CafeteriaList;
