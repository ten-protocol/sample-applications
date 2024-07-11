import * as React from "react";
import HudWindow from "../HudWindow/HudWindow";
import { useEffect, useState } from "react";
import { useContractStore } from "../../stores/contractStore";
import {useWalletStore} from "../../stores/walletStore";

export default function PrizePool() {
  const [hits, misses, prizePool, getPrizePool] = useContractStore((state) => [
    state.hits,
    state.misses,
    state.prizePool,
    state.getPrizePool,
  ]);
  const isConnected = useWalletStore(state => state.isConnected)
  const [totalGuesses, setTotalGuesses] = useState(hits.length + misses.length);

  useEffect(() => {
    setTotalGuesses(hits.length + misses.length);
  }, [hits, misses]);

  useEffect(() => {
    if (isConnected) {
      getPrizePool();
    }
  }, [totalGuesses]);

  const Disconnected = <p className="text-center">System Offline</p>

  return (
    <HudWindow headerTitle="Prize pool" isOpen={isConnected} closedContent={Disconnected}>
      <h3 className="text-3xl text-right my-2">{prizePool} <span className="text-xl">ETH</span></h3>
    </HudWindow>
  );
}
