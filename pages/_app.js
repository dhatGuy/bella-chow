import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { AuthProvider } from "../components/context/AuthContext";
import { CartProvider } from "../components/context/CartContext";
import { OrderProvider } from "../components/context/OrderContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
    },
  },
});

function MyApp({ Component, pageProps }) {
  return (
    // <QueryClientProvider client={queryClient}>
    <ChakraProvider>
      <AuthProvider>
        <CartProvider>
          <OrderProvider>
            <Component {...pageProps} />
          </OrderProvider>
        </CartProvider>
      </AuthProvider>
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </ChakraProvider>
    // {/* </QueryClientProvider> */}
  );
}

export default MyApp;
