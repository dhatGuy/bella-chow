import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { NextPage } from "next";
import type { AppProps } from "next/app";
import Router from "next/router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { ReactElement, ReactNode, useEffect } from "react";
import AdminLayout from "~components/AdminLayout";
import Layout from "~components/Layout";
import { AuthProvider } from "~context/AuthContext";
import { CartProvider } from "~context/CartContext";
import { OrderProvider } from "~context/OrderContext";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
    },
  },
});

const layouts = {
  admin: AdminLayout,
  default: Layout,
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
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

  const getLayout = Component.getLayout ?? ((page) => <Layout>{page}</Layout>);

  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>
        <AuthProvider>
          <CartProvider>
            <OrderProvider>
              {getLayout(<Component {...pageProps} />)}
            </OrderProvider>
          </CartProvider>
        </AuthProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </ChakraProvider>
    </QueryClientProvider>
  );
}

export default MyApp;
