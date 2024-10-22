import { socialLinks } from "./constants";

export const siteMetadata = {
  companyName: "TEN's Constitution DAO'n",
  metaTitle:
    "TEN's Constitution DAO'n | Private Threshold Auctions & Hidden Bidding",
  description:
    "Experience what ConstitutionDAO could have been with TEN's revolutionary private threshold auction platform. Hide your bid amount from competitors, protect against MEV, and participate in secure collective bidding with encrypted contributions. Built on TEN's privacy-preserving L2, enabling fair and strategic participation in high-stakes auctions through advanced on-chain privacy features.",
  keywords: [
    // Core Features
    "private threshold auctions",
    "hidden bidding mechanism",
    "encrypted contributions",
    "MEV protection",
    "secure random number generation",
    // Historical Context
    "ConstitutionDAO reimagined",
    "collective bidding",
    "DAO auctions",
    "decentralized bidding",
    // Technical Features
    "TEN network",
    "private L2",
    "encrypted blockchain",
    "shared private state",
    "threshold cryptography",
    // Use Cases
    "private fundraising",
    "secure collective buying",
    "strategic auction bidding",
    "fair price discovery",
    "private group coordination",
  ].join(", "),
  siteUrl: `constitution-dao.ten.xyz`,
  siteLogo: `/assets/images/cover.png`,
  siteLogoSquare: `/assets/images/cover.png`,
  email: "team@ten.xyz",
  twitter: socialLinks.twitter,
  twitterHandle: socialLinks.twitterHandle,
  github: socialLinks.github,

  // OpenGraph metadata
  ogTitle: "Reimagining ConstitutionDAO with TEN's Private Threshold Auctions",
  ogDescription:
    "Join the next evolution of collective bidding where your strategy stays private. TEN's encrypted L2 enables hidden contributions, MEV protection, and fair participation in high-stakes auctions - the features ConstitutionDAO needed.",
  ogImage: `/assets/images/cover.png`,
  ogType: "website",

  // Twitter specific metadata
  twitterCard: "summary_large_image",
  twitterCreator: "@TENNetwork",
  twitterSite: "@TENNetwork",

  // Additional structured metadata
  structuredData: {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "TEN's Constitution DAO'n",
    applicationCategory: "DeFi",
    operatingSystem: "Web3",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "ETH",
    },
    featureList: [
      "Private Threshold Auctions",
      "Hidden Contribution Amounts",
      "MEV Protection",
      "Secure RNG",
      "Encrypted L2 Technology",
    ],
  },

  additionalMetaTags: [
    {
      name: "application-name",
      content: "TEN's Constitution DAO'n",
    },
    {
      name: "author",
      content: "TEN Network",
    },
    {
      name: "generator",
      content: "TEN Network",
    },
    {
      name: "theme-color",
      content: "#000000",
    },
    {
      name: "viewport",
      content: "width=device-width, initial-scale=1.0",
    },
    {
      name: "robots",
      content: "index, follow",
    },
    {
      property: "article:publisher",
      content: "https://ten.xyz",
    },
    {
      name: "application-type",
      content: "Web3 DApp",
    },
    {
      name: "format-detection",
      content: "telephone=no",
    },
  ],

  additionalLinkTags: [
    {
      rel: "icon",
      href: "/favicon.ico",
    },
    {
      rel: "apple-touch-icon",
      href: "/apple-touch-icon.png",
      sizes: "180x180",
    },
    {
      rel: "manifest",
      href: "/site.webmanifest",
    },
    {
      rel: "canonical",
      href: "https://constitution-dao.ten.xyz",
    },
    {
      rel: "preconnect",
      href: "https://fonts.gstatic.com",
      crossOrigin: "anonymous",
    },
  ],

  // App-specific metadata
  appFeatures: {
    privacyLevel: "Maximum",
    network: "TEN L2",
    contractAddress: "0xDB8445Fd7704A2C43de03692523b2373B1E6A3A5",
    supportedWallets: ["MetaMask", "WalletConnect"],
    auctionType: "Private Threshold",
    mevProtection: true,
    encryption: "TEE-based",
  },
};
