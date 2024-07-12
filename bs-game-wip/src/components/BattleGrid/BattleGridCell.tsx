import { Graphics } from "@pixi/react";

import { hexHitArea } from "@/lib/constants";

export default function BattleGridCell({ col, row, x, y, state }) {
  return (
    <>
      <Graphics
        key={`${row}-${col}`}
        draw={(g) => {
          g.position.set(x, y);
          g.clear();

          if (state === "UNTOUCHED") {
            g.beginFill(0xd9d9d9, 0);
            g.lineStyle(1, 0x464646, 1);
          }
          if (state === "MISSED") {
            g.beginFill(0x5a5a5a, 1);
            g.lineStyle(1, 0x4f4f4f, 1);
          }
          if (state === "HIT") {
            g.beginFill(0xe16f6f, 1);
            g.lineStyle(1, 0xe16f6f, 1);
          }

          g.drawPolygon(hexHitArea);
          g.endFill();
        }}
      />
    </>
  );
}
