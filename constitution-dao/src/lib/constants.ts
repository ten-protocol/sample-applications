export const socialLinks = {
  github: "https://github.com/ten-protocol",
  discord: "https://discord.gg/tenprotocol",
  twitter: "https://twitter.com/tenprotocol",
  twitterHandle: "@tenprotocol",
  email: "team@ten.xyz",
};

export const RESET_COPIED_TIMEOUT = 2000;

export const environment =
  process.env.NEXT_PUBLIC_BRIDGE_API_HOST_ENVIRONMENT || "uat-testnet";

export const tenGatewayAddress = process.env.NEXT_PUBLIC_GATEWAY_URL;

export const MD_SCREEN_WIDTH = 1024;
export const MD_SCREEN_WIDTH_QUERY = `(min-width: ${MD_SCREEN_WIDTH}px)`;
