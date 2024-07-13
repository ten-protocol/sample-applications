import { useMemo } from 'react';

import { Container } from '@pixi/react';

import { useBattleGridStore } from '@/stores/battleGridStore';

import BattleGridCell from './BattleGridCell';

export default function BattleGridHits() {
    const hitCells = useBattleGridStore((state) => state.hitCells);
    const revealedGridCells = useMemo(
        () =>
            hitCells.map(({ row, col, x, y }) => (
                <BattleGridCell key={`${row}-${col}`} x={x} y={y} row={row} col={col} state="HIT" />
            )),
        [hitCells]
    );

    return <Container>{revealedGridCells}</Container>;
}
