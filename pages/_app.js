import { ChakraProvider } from "@chakra-ui/react";
import AdminLayout from "@components/AdminLayout";
import Layout from "@components/Layout";
import { AuthProvider } from "@context/AuthContext";
import { CartProvider } from "@context/CartContext";
import { OrderProvider } from "@context/OrderContext";
import Router from "next/router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
    },
  },
});

function MyApp({ Component, pageProps, router }) {
  useEffect(() => {
    const delay = 500; // in milliseconds
    let timer;
    const load = () => {
      timer = setTimeout(function () {
        NProgress.start();
      }, delay);
    };
    const stop = () => {
      clearTimeout(timer);
      NProgress.done();
    };

    Router.events.on("routeChangeStart", () => NProgress.start());
    Router.events.on("routeChangeComplete", () => NProgress.done());
    Router.events.on("routeChangeError", () => NProgress.done());
    NProgress.configure({ showSpinner: false });
  }, []);
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
