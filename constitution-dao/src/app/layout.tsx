"use client";

import "./styles/globals.css";
import Layout from "./components/layouts/default-layout";
import HeadSeo from "./components/head-seo";
import { siteMetadata } from "../lib/siteMetadata";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NetworkStatus } from "./components/common/network-status";
import { Toaster } from "./components/ui/toaster";
import { ThemeProvider } from "./components/providers/theme-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = new QueryClient();

  return (
    // <WagmiProvider config={wagmiConfig}>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {/* <RainbowKitProvider> */}
        <html lang="en">
          <HeadSeo
            title={`${siteMetadata.companyName} `}
            description={siteMetadata.description}
            canonicalUrl={`${siteMetadata.siteUrl}`}
            ogImageUrl={siteMetadata.siteLogo}
            ogTwitterImage={siteMetadata.siteLogo}
            ogType={"website"}
          ></HeadSeo>
          <body>
            <Layout>{children}</Layout>
          </body>
        </html>
        <Toaster />
        <NetworkStatus />
      </ThemeProvider>
      {/* </RainbowKitProvider> */}
    </QueryClientProvider>
    // </WagmiProvider>
  );
}
