import { useMemo } from 'react';

import { Graphics } from '@pixi/react';

import drawGridCells from '@/helpers/drawGridCells';
import { useGameStore } from '@/stores/gameStore';

export default function BattleGridHits() {
    const hitCells = useGameStore((state) => state.hitCells);

    return useMemo(() => <Graphics draw={(g) => drawGridCells(g, hitCells, 'HIT')} />, [hitCells]);
}
