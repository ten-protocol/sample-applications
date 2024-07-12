import { useBattleGridStore } from "@/stores/battleGridStore";

export default function BattleGridCurrentCoordinates() {
  const currentHoveredCell = useBattleGridStore((state) => state.hoveredCell);

  return (
    <h6>
      X:{currentHoveredCell?.col}, Y: {currentHoveredCell?.row}
    </h6>
  );
}
