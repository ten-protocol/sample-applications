import { useMemo } from 'react';

import { Graphics } from '@pixi/react';

import drawGridCells from '@/helpers/drawGridCells';
import { useBattleGridStore } from '@/stores/battleGridStore';

export default function BattleGridHits() {
    const hitCells = useBattleGridStore((state) => state.hitCells);

    return useMemo(() => <Graphics draw={(g) => drawGridCells(g, hitCells, 'HIT')} />, [hitCells]);
}
