
import { useWalletStore } from "@/stores/walletStore";
import { useMessageStore } from "@/stores/messageStore";

import * as React from "react";
import HudWindow from "../HudWindow/HudWindow";
import metaMaskLogo from "@/assets/metamask-logo.svg"

export default function MetaMask() {
  const [provider, address, setAddress] = useWalletStore((state) => [
      state.provider,
    state.address,
    state.setAddress,
  ]);
  const addNewMessage = useMessageStore((state) => state.addNewMessage);

  const connectAccount = async () => {
    if (provider) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAddress(accounts[0]);
      } catch (error) {
          addNewMessage("User rejected the request.", "ERROR");
      }
    }
  };

  return (
      <HudWindow headerTitle="Connection Status" footerContent={<div className="flex gap-4">
        <img src={metaMaskLogo} width={50}/>
        {address ? (
            <p>MetaMask Connected</p>
        ) : (
            <button onClick={connectAccount}>Connect to MetaMask</button>
        )}
      </div>}>
      </HudWindow>
  );
}
