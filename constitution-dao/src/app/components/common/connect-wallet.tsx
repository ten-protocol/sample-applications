import React from "react";
import { Link2Icon, Link2OffIcon, TriangleAlertIcon } from "lucide-react";
import { cn, downloadMetaMask, ethereum } from "@/src/lib/utils";
import useWalletStore from "@/src/stores/wallet-store";
import TruncatedAddress from "./truncated-address";
import { ButtonVariants } from "@/src/lib/types/ui";
import { Button } from "../ui/button";

interface ConnectWalletButtonProps {
  className?: string;
  text?: string;
  variant?: ButtonVariants;
}

const ConnectWalletButton = ({
  className,
  text = "Connect Wallet",
  variant = "outline",
}: ConnectWalletButtonProps) => {
  const {
    walletConnected,
    connectWallet,
    disconnectWallet,
    isWrongNetwork,
    switchNetwork,
    address,
  } = useWalletStore();

  const handleClick = () => {
    if (!ethereum) {
      return downloadMetaMask;
    }

    if (isWrongNetwork) {
      switchNetwork();
      return;
    }

    if (walletConnected) {
      disconnectWallet();
    } else {
      connectWallet();
    }
  };

  const renderButtonContent = () => {
    if (!ethereum) {
      return (
        <>
          <Link2Icon className="h-4 w-4 mr-1" />
          Download MetaMask
        </>
      );
    }

    if (isWrongNetwork) {
      return (
        <>
          <TriangleAlertIcon className="h-4 w-4 mr-1 text-yellow-500" />
          Unsupported network
        </>
      );
    }

    return walletConnected ? (
      <>
        <Link2OffIcon className="h-4 w-4 mr-1" />
        {<TruncatedAddress address={address} showCopy={false} />}
      </>
    ) : (
      <>
        <Link2Icon className="h-4 w-4 mr-1" />
        {text}
      </>
    );
  };

  return (
    <Button
      className={cn("text-sm font-medium leading-none", className)}
      variant={variant}
      onClick={handleClick}
      suppressHydrationWarning
    >
      {renderButtonContent()}
    </Button>
  );
};

export default ConnectWalletButton;
