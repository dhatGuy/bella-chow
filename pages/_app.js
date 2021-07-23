import { Box, ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { AuthProvider } from "@context/AuthContext";
import { CartProvider } from "@context/CartContext";
import { OrderProvider } from "@context/OrderContext";
import Layout from "@components/Layout";
import AdminLayout from "@components/AdminLayout";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
    },
  },
});

function MyApp({ Component, pageProps, router }) {
  if (router.pathname.startsWith("/dashboard")) {
    return (
      <QueryClientProvider client={queryClient}>
        <ChakraProvider>
          <AuthProvider>
            <CartProvider>
              <OrderProvider>
                <AdminLayout>
                  <Component {...pageProps} />
                </AdminLayout>
              </OrderProvider>
            </CartProvider>
          </AuthProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </ChakraProvider>
      </QueryClientProvider>
    );
  }
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>
        <AuthProvider>
          <CartProvider>
            <OrderProvider>
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </OrderProvider>
          </CartProvider>
        </AuthProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </ChakraProvider>
    </QueryClientProvider>
  );
}

export default MyApp;
