import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ThresholdIntentAuction from "./components/common/ThresholdIntentAuction";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { wagmiConfig } from "../lib/wagmiConfig";

export default function Home() {
  const queryClient = new QueryClient();
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <ThresholdIntentAuction />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
