import { useMemo } from 'react';

import { Graphics } from '@pixi/react';

import drawGridCells from '@/helpers/drawGridCells';
import { useBattleGridStore } from '@/stores/battleGridStore';

export default function BattleGridMisses() {
    const missedCells = useBattleGridStore((state) => state.missedCells);

    return useMemo(
        () => <Graphics draw={(g) => drawGridCells(g, missedCells, 'MISS')} />,
        [missedCells]
    );
}
