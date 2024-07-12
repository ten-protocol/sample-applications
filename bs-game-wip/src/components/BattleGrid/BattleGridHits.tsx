import React, { useEffect, useMemo, useRef } from "react";

import { GlowFilter } from "@pixi/filter-glow";
import { Container, useTick } from "@pixi/react";

import { QUERY_INTERVAL_MS } from "@/lib/constants";
import { useBattleGridStore } from "@/stores/battleGridStore";
import { useContractStore } from "@/stores/contractStore";
import { useWalletStore } from "@/stores/walletStore";

import BattleGridCell from "./BattleGridCell";

export default function BattleGridHits() {
  const hitCells = useBattleGridStore((state) => state.hitCells);
  const isConnected = useWalletStore((state) => state.isConnected);
  const getAllHits = useContractStore((state) => state.getAllHits);
  const revealedGridCells = useMemo(
    () =>
      hitCells.map(({ row, col, x, y }) => (
        <BattleGridCell
          key={`${row}-${col}`}
          x={x}
          y={y}
          row={row}
          col={col}
          state="HIT"
        />
      )),
    [hitCells],
  );

  useEffect(() => {
    let interval;

    if (isConnected) {
      getAllHits();
      interval = setInterval(() => {
        getAllHits();
      }, QUERY_INTERVAL_MS);
    }

    return () => clearInterval(interval);
  }, [isConnected]);

  return <Container>{revealedGridCells}</Container>;
}
