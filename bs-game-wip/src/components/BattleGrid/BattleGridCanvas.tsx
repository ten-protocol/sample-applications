import { useMemo } from "react";

import { BloomFilter } from "@pixi/filter-bloom";
import { Container, Stage } from "@pixi/react";

import { HEX_HEIGHT, HEX_WIDTH, HEX_GRID_MARGIN } from "@/lib/constants";

import BattleGridCell from "./BattleGridCell";
import BattleGridCursor from "./BattleGridCursor";
import BattleGridHits from "./BattleGridHits";
import BattleGridMisses from "./BattleGridMisses";

export default function BattleGridCanvas({ grid, width, height }) {
  const bloomFilter = new BloomFilter(3, 3, 2);

  const gridCells = useMemo(
    () =>
      grid.map(({ row, col, x, y }) => (
        <BattleGridCell
          key={`${row}-${col}`}
          x={x}
          y={y}
          row={row}
          col={col}
          state="UNTOUCHED"
        />
      )),
    [grid],
  );

  return (
    <Stage
      width={HEX_WIDTH * width + HEX_GRID_MARGIN * 1.5}
      height={HEX_HEIGHT * height * 0.75 + HEX_GRID_MARGIN}
      options={{
        backgroundAlpha: 0,
        antialias: true,
        resolution: window.devicePixelRatio,
      }}
    >
      <Container filters={[]}>
        <Container>{gridCells}</Container>
        <BattleGridMisses />
        <BattleGridHits />
        <Container>
          <BattleGridCursor />
        </Container>
      </Container>
    </Stage>
  );
}
