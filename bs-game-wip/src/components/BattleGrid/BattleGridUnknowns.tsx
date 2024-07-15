import { useMemo } from 'react';

import { Graphics } from '@pixi/react';

import drawGridCells from '@/helpers/drawGridCells';
import { useBattleGridStore } from '@/stores/battleGridStore';

export default function BattleGridUnknowns() {
    const unknownCells = useBattleGridStore((state) => state.unknownCells);

    const gridCells = useMemo(
        () => <Graphics draw={(g) => drawGridCells(g, unknownCells, 'UNKNOWN')} />,
        [unknownCells, unknownCells]
    );

    if (unknownCells.length === 0) {
        return null;
    }

    return gridCells;
}
