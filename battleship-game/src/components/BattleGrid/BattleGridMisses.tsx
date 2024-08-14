import { useMemo } from 'react';

import { Graphics } from '@pixi/react';

import drawGridCells from '@/helpers/drawGridCells';
import { useGameStore } from '@/stores/gameStore';

export default function BattleGridMisses() {
    const missedCells = useGameStore((state) => state.missedCells);

    return useMemo(
        () => <Graphics draw={(g) => drawGridCells(g, missedCells, 'MISS')} />,
        [missedCells]
    );
}
