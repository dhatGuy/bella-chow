import { Box, Flex } from "@chakra-ui/react";
import { FC, PropsWithChildren } from "react";
import Sidebar from "~components/dashboard/Sidebar";
import Layout from "./Layout";

const AdminLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Layout>
      <Flex
        h={[null, null, "100%"]}
        maxW="2000px"
        flexDir={["column", "column", "row"]}
        overflow="hidden"
      >
        <Sidebar />
        <Box my="2" w="100%">
          {children}
        </Box>
      </Flex>
    </Layout>
  );
};

export default AdminLayout;
