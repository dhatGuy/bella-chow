import { Center, Spinner as ChakraSpinner } from "@chakra-ui/react";

function Spinner() {
  return (
    <Center h={"calc(100vh - 64px)"}>
      <ChakraSpinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="blue.500"
        size="xl"
      />
    </Center>
  );
}

export default Spinner;
