import { Center, Spinner } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import useUser from "~hooks/auth/useUser";

function WithCafeAuth<T>(Component: React.ComponentType<T>) {
  function MyComponent(props: T & {}) {
    const { isLoading, data: user } = useUser();
    const router = useRouter();

    useEffect(() => {
      if (!isLoading && !user) {
        router.push({
          pathname: "/login",
          query: { from: router.pathname },
        });
      }
      if (!isLoading && !user?.cafe_owner) {
        router.push("/");
      }
    }, [user, isLoading, router]);

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
  }

  return MyComponent;
}

export default WithCafeAuth;
