import { useGameStore } from '@/stores/gameStore';

export default function BattleGridCurrentCoordinates() {
    const currentHoveredCell = useGameStore((state) => state.hoveredCell);

    return (
        <h6>
            X:{currentHoveredCell?.col}, Y: {currentHoveredCell?.row}
        </h6>
    );
}
