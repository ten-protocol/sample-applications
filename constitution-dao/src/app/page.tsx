"use client";

import { siteMetadata } from "../lib/siteMetadata";
import ThresholdIntentAuction from "./components/common/ThresholdIntentAuction";
import HeadSeo from "./components/head-seo";

export default function Home() {
  return (
    <>
      <HeadSeo
        title={`${siteMetadata.companyName} `}
        description={siteMetadata.description}
        canonicalUrl={`${siteMetadata.siteUrl}`}
        ogImageUrl={siteMetadata.siteLogo}
        ogTwitterImage={siteMetadata.siteLogo}
        ogType={"website"}
      ></HeadSeo>
      <ThresholdIntentAuction />;
    </>
  );
}
