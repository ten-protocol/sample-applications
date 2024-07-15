import { useMemo } from 'react';

import { Container, Graphics, Stage } from '@pixi/react';

import CellHighlight from '@/components/CellHighlight/CellHighlight';
import drawGridCells from '@/helpers/drawGridCells';
import { HEX_GRID_MARGIN, HEX_HEIGHT, HEX_WIDTH } from '@/lib/constants';
import { Cell } from '@/stores/gameStore';

import BattleGridCursor from './BattleGridCursor';
import BattleGridExplosion from './BattleGridExplosion';
import BattleGridHits from './BattleGridHits';
import BattleGridMisses from './BattleGridMisses';
import BattleGridUnknowns from './BattleGridUnknowns';

type Props = {
    grid: Cell[];
    width: number;
    height: number;
};

export default function BattleGridCanvas({ grid, width, height }: Props) {
    const gridCells = useMemo(() => <Graphics draw={(g) => drawGridCells(g, grid)} />, [grid]);

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
            <Container>
                {gridCells}
                <BattleGridUnknowns />
                <BattleGridMisses />
                <BattleGridHits />
            </Container>
            <CellHighlight />
            <BattleGridExplosion particleCount={40} duration={1000} />
            <BattleGridCursor />
        </Stage>
    );
}
