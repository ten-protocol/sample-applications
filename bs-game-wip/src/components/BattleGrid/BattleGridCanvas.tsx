import { useMemo } from 'react';

import { Container, Stage } from '@pixi/react';

import { HEX_GRID_MARGIN, HEX_HEIGHT, HEX_WIDTH } from '@/lib/constants';

import BattleGridCell from './BattleGridCell';
import BattleGridCursor from './BattleGridCursor';
import BattleGridExplosion from './BattleGridExplosion';
import BattleGridHits from './BattleGridHits';
import BattleGridMisses from './BattleGridMisses';

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
                resolution: Math.floor(window.devicePixelRatio),
                autoDensity: true,
            }}
        >
            <Container>{gridCells}</Container>
            <BattleGridMisses />
            <BattleGridHits />
            <BattleGridExplosion particleCount={50} duration={1000} />
            <BattleGridCursor />
        </Stage>
    );
}
