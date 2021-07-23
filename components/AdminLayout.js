import { Box, Flex } from "@chakra-ui/react";
import Sidebar from "@components/dashboard/Sidebar";
import Layout from "./Layout";

const AdminLayout = ({ children }) => {
  return (
    <Layout>
      <Flex
        h={[null, null, "90vh"]}
        maxW="2000px"
        flexDir={["column", "column", "row"]}
        overflow="hidden"
      >
        <Sidebar />
        <>{children}</>
      </Flex>
    </Layout>
  );
};

export default AdminLayout;
