import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AppProps } from "next/app";
import Router from "next/router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { useEffect } from "react";
import AdminLayout from "~components/AdminLayout";
import Layout from "~components/Layout";
import { AuthProvider } from "~context/AuthContext";
import { CartProvider } from "~context/CartContext";
import { OrderProvider } from "~context/OrderContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
    },
  },
});

function MyApp({ Component, pageProps, router }: AppProps) {
  useEffect(() => {
    const delay = 500; // in milliseconds
    let timer: string | number | NodeJS.Timeout | undefined;
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

  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>
        <AuthProvider>
          <CartProvider>
            <OrderProvider>
              {router.pathname.startsWith("/dashboard") ? (
                <AdminLayout>
                  <Component {...pageProps} />
                </AdminLayout>
              ) : (
                <Layout>
                  <Component {...pageProps} />
                </Layout>
              )}
            </OrderProvider>
          </CartProvider>
        </AuthProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </ChakraProvider>
    </QueryClientProvider>
  );
}

export default MyApp;
