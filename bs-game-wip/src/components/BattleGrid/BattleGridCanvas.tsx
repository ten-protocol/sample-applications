import React, {useEffect, useMemo, useRef, useState} from "react";
import BattleGridCell from "./BattleGridCell";
import { Container, Stage } from "@pixi/react";
import BattleGridCursor from "./BattleGridCursor";
import {
  CONTAINER_HEIGHT,
  CONTAINER_WIDTH,
  HEX_HEIGHT,
  HEX_WIDTH,
} from "@/lib/constants";
import BattleGridMisses from "./BattleGridMisses";
import BattleGridHits from "./BattleGridHits";
import {BloomFilter} from "@pixi/filter-bloom";
import {HEX_GRID_MARGIN} from "../../lib/constants";

export default function BattleGridCanvas({ grid, width, height }) {
  const [viewport, setViewport] = useState({
    width: CONTAINER_WIDTH,
    height: CONTAINER_HEIGHT,
  });
    const bloomFilter = new BloomFilter(3, 3, 2);

  const gridCells = useMemo(
    () =>
      grid.map(({ row, col, x, y, state }) => (
        <BattleGridCell
          key={`${row}-${col}`}
          x={x}
          y={y}
          row={row}
          col={col}
          state="UNTOUCHED"
        />
      )),
    [grid]
  );

  return (
    <Stage
      width={(HEX_WIDTH * width) + (HEX_GRID_MARGIN * 1.5)}
      height={(HEX_HEIGHT * height * 0.75) + HEX_GRID_MARGIN}
      options={{
          backgroundAlpha: 0,
          antialias: true,
        resolution: window.devicePixelRatio,
        autoResize: true,
      }}
    >

      {/*<Container>*/}
      <Container filters={[]}>
        {/*{hexagons.map(*/}
        {/*  ({ row, col, x, y }) =>*/}
        {/*    isInViewport(x, y, viewport, scrollPosition) && (*/}
        {/*      <Hexagon key={`${row}-${col}`} x={x} y={y} coords={[col, row]} />*/}
        {/*    )*/}
        {/*)}*/}

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
