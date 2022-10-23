import { Stack } from "@chakra-ui/react";
import { CafeteriaWithReviews } from "~types";
import Cafeteria from "./Cafeteria";

interface CafeteriaListProps {
  cafes: CafeteriaWithReviews[];
}

const CafeteriaList = ({ cafes }: CafeteriaListProps) => {
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
