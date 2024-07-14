import { useMemo } from 'react';

import { Container, Stage } from '@pixi/react';

import CellHighlight from '@/components/CellHighlight/CellHighlight';
import { HEX_GRID_MARGIN, HEX_HEIGHT, HEX_WIDTH } from '@/lib/constants';

import BattleGridCell from './BattleGridCell';
import BattleGridCursor from './BattleGridCursor';
import BattleGridExplosion from './BattleGridExplosion';
import BattleGridHits from './BattleGridHits';
import BattleGridMisses from './BattleGridMisses';
import BattleGridUnknowns from './BattleGridUnknowns';

export default function BattleGridCanvas({ grid, width, height }) {
    const gridCells = useMemo(
        () =>
            grid.map(({ row, col, x, y }) => (
                <BattleGridCell
                    key={`${row}-${col}`}
                    x={x}
                    y={y}
                    row={row}
                    col={col}
                    state="UNTOUCHED"
                />
            )),
        [grid]
    );

    return (
        <Stage
            width={HEX_WIDTH * width + HEX_GRID_MARGIN * 1.5}
            height={HEX_HEIGHT * height * 0.75 + HEX_GRID_MARGIN}
            options={{
                backgroundAlpha: 0,
                antialias: true,
                resolution: 2,
                autoDensity: true,
            }}
        >
            <Container>{gridCells}</Container>
            <BattleGridUnknowns />
            <BattleGridMisses />
            <BattleGridHits />
            <CellHighlight particleCount={20} />
            <BattleGridExplosion particleCount={40} duration={1000} />
            <BattleGridCursor />
        </Stage>
    );
}
