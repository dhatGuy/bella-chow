import { Box } from "@chakra-ui/react";
import NavBar from "./NavBar";

const Layout = ({ children }) => {
  return (
    <Box>
      <NavBar />
      {children}
    </Box>
  );
};

export default Layout;
