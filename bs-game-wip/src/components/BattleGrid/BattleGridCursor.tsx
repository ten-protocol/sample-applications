import React, { useRef } from "react";

import { Graphics, useTick } from "@pixi/react";

import {
  HEX_HEIGHT,
  HEX_WIDTH,
  VERTICAL_OFFSET,
  hexHitArea,
} from "@/lib/constants";
import { useBattleGridStore } from "@/stores/battleGridStore";
import { useContractStore } from "@/stores/contractStore";

export default function BattleGridCursor() {
  const [[x, y], hoveredCell] = useBattleGridStore((state) => [
    state.mousePosition,
    state.hoveredCell,
  ]);
  const guessState = useContractStore((state) => state.guessState);
  const isLoadingState = guessState !== "IDLE";
  const shapeRef = useRef(null);
  const scaleRef = useRef(1);
  const directionRef = useRef(1);
  const timeRef = useRef(0);

  useTick((delta) => {
    if (shapeRef.current) {
      timeRef.current += delta;
      const scaleSpeed = 0.1;
      const rotationSpeed = 1;
      const maxScale = 1;
      const minScale = isLoadingState ? 0.7 : 0.9;
      const scaleRange = (maxScale - minScale) / 2;
      const midScale = (maxScale + minScale) / 2;
      const newScale =
        midScale + Math.sin(timeRef.current * scaleSpeed) * scaleRange;

      shapeRef.current.scale.set(newScale);

      if (isLoadingState) {
        shapeRef.current.rotation += timeRef.current * rotationSpeed;
      } else {
        shapeRef.current.rotation = 0;
      }
    }
  });

  if (!hoveredCell) {
    return null;
  }

  return (
    <Graphics
      ref={shapeRef}
      draw={(g) => {
        g.position.set(x, y);
        g.clear();
        g.lineStyle(1, 0xffffff, 1);
        g.drawPolygon(hexHitArea);
        g.endFill();
      }}
    />
  );
}
