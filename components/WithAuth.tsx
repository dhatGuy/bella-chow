import { Center, Spinner } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAuth } from "~context/AuthContext";

const WithAuth = (Component) => {
  const MyComponent = (props) => {
    const { loading, user } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !user) {
        router.push({
          pathname: "/login",
          query: { from: router.pathname },
        });
      }
    }, [user, loading, router]);

    if (user) {
      return <Component {...props} />;
    }

    return (
      <Center h={"calc(100vh - 64px)"}>
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
      </Center>
    );
  };

  return MyComponent;
};

export default WithAuth;
