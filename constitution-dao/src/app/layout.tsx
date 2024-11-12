"use client";

import "../styles/globals.css";
import Layout from "./components/layouts/default-layout";
import HeadSeo from "./components/head-seo";
import { siteMetadata } from "../lib/siteMetadata";
import { NetworkStatus } from "./components/common/network-status";
import { Toaster } from "./components/ui/toaster";
import { ThemeProvider } from "./components/providers/theme-provider";
import { ReactQueryProvider } from "./components/providers/react-query-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // <WagmiProvider config={wagmiConfig}>
    <ReactQueryProvider>
      <html lang="en">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* <RainbowKitProvider> */}
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
            <Toaster />
            <NetworkStatus />
          </body>
        </ThemeProvider>
      </html>
      {/* </RainbowKitProvider> */}
    </ReactQueryProvider>
    // </WagmiProvider>
  );
}
