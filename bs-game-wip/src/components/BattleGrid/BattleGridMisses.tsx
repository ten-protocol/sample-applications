import React, { useMemo } from 'react';

import { Container } from '@pixi/react';

import { useBattleGridStore } from '@/stores/battleGridStore';

import BattleGridCell from './BattleGridCell';

export default function BattleGridMisses() {
    const missedCells = useBattleGridStore((state) => state.missedCells);

    const revealedGridCells = useMemo(
        () =>
            missedCells.map(({ row, col, x, y }) => (
                <BattleGridCell
                    key={`${row}-${col}`}
                    x={x}
                    y={y}
                    row={row}
                    col={col}
                    state="MISSED"
                />
            )),
        [missedCells]
    );

    // useEffect(() => {
    //   let interval;
    //
    //   if (isConnected) {
    //     getAllMisses();
    //     interval = setInterval(() => {
    //       getAllMisses();
    //     }, QUERY_INTERVAL_MS);
    //   }
    //
    //   return () => clearInterval(interval);
    // }, [isConnected]);

    return <Container>{revealedGridCells}</Container>;
}
