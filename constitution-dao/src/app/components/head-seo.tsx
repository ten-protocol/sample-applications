import { SeoProps } from "@/src/lib/interfaces/ui";
import { siteMetadata } from "@/src/lib/siteMetadata";
import Head from "next/head";
import Link from "next/link";

interface EnhancedSeoProps extends SeoProps {
  structuredData?: object;
  ogLocale?: string;
  noindex?: boolean;
  nofollow?: boolean;
  additionalMetaTags?: Array<{ name: string; content: string }>;
  additionalLinkTags?: Array<{
    rel: string;
    href: string;
    sizes?: string;
    crossOrigin?: string;
  }>;
}

const HeadSeo = ({
  title,
  description,
  canonicalUrl,
  ogTwitterImage,
  ogImageUrl,
  ogType = "website",
  includeDefaultKeywords = true,
  structuredData,
  ogLocale = "en_US",
  noindex = false,
  nofollow = false,
  additionalMetaTags = [],
  additionalLinkTags = [],
  children,
}: EnhancedSeoProps) => {
  const robotsContent = [
    noindex ? "noindex" : "index",
    nofollow ? "nofollow" : "follow",
    "max-image-preview:large",
    "max-snippet:-1",
    "max-video-preview:-1",
  ].join(", ");

  const defaultStructuredData = {
    // @ts-expect-error - structuredData is optional
    "@context": "https://schema.org",
    // @ts-expect-error - structuredData is optional
    "@type": "WebApplication",
    // @ts-expect-error  - structuredData is optional
    name: siteMetadata.companyName,
    // @ts-expect-error - structuredData is optional
    applicationCategory: "DeFi",
    // @ts-expect-error - structuredData is optional
    operatingSystem: "Web3",
    ...siteMetadata.structuredData,
    ...structuredData,
  };

  return (
    <Head>
      {/* Basic metadata */}
      <title>{`${title} | ${siteMetadata.companyName}`}</title>
      <meta charSet="utf-8" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, shrink-to-fit=no"
      />
      <meta name="description" content={description} />
      {includeDefaultKeywords && (
        <meta name="keywords" content={siteMetadata.keywords} />
      )}

      {/* Security headers */}
      <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
      <meta httpEquiv="X-Frame-Options" content="DENY" />
      <meta httpEquiv="Permissions-Policy" content="interest-cohort=()" />
      <meta name="referrer" content="strict-origin-when-cross-origin" />
      <meta
        name="_vgeujvlkxz15hyr8vbuvqxnfmzlkm059"
        //@ts-expect-error - This is a custom meta tag
        signature="_vd3udx2g2hfn9zclob5cat43b94q7fyk"
      />

      {/* Search engine directives */}
      <meta name="robots" content={robotsContent} />

      {/* Twitter metadata */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={siteMetadata.twitterHandle} />
      <meta name="twitter:creator" content={siteMetadata.twitterCreator} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={decodeURIComponent(ogTwitterImage)} />
      <meta name="twitter:image:alt" content={`${title} preview image`} />

      {/* Open Graph metadata */}
      <meta property="og:locale" content={ogLocale} />
      <meta property="og:site_name" content={siteMetadata.companyName} />
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={decodeURIComponent(ogImageUrl)} />
      <meta property="og:image:alt" content={`${title} preview image`} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {/* App specific metadata */}
      <meta name="application-name" content={siteMetadata.companyName} />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta
        name="apple-mobile-web-app-title"
        content={siteMetadata.companyName}
      />
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="theme-color" content="#000000" />

      {/* Links */}
      <link rel="canonical" href={canonicalUrl} />
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/site.webmanifest" />

      {/* Additional meta tags */}
      {additionalMetaTags.map((tag, index) => (
        <meta key={index} name={tag.name} content={tag.content} />
      ))}

      {/* Additional link tags */}
      {additionalLinkTags.map((tag, index) => (
        <Link
          key={index}
          rel={tag.rel}
          href={tag.href}
          {...(tag.sizes && { sizes: tag.sizes })}
          {...(tag.crossOrigin && { crossOrigin: tag.crossOrigin })}
        />
      ))}

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(defaultStructuredData),
        }}
      />

      {children}
    </Head>
  );
};

export default HeadSeo;
