import { useMemo } from 'react';

import { Container } from '@pixi/react';

import { useBattleGridStore } from '@/stores/battleGridStore';

import BattleGridCell from './BattleGridCell';

export default function BattleGridUnknowns() {
    const unknownCells = useBattleGridStore((state) => state.unknownCells);

    const revealedGridCells = useMemo(
        () =>
            unknownCells.map(({ row, col, x, y }) => (
                <BattleGridCell
                    key={`${row}-${col}`}
                    x={x}
                    y={y}
                    row={row}
                    col={col}
                    state="UNKNOWN"
                />
            )),
        [unknownCells]
    );

    if (unknownCells.length === 0) {
        return null;
    }

    return <Container>{revealedGridCells}</Container>;
}
