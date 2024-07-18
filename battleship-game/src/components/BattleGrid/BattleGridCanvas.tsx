
import { Container, Stage } from '@pixi/react';

import CellHighlight from '@/components/CellHighlight/CellHighlight';
import {COLS, HEX_GRID_MARGIN, HEX_HEIGHT, HEX_WIDTH, ROWS} from '@/lib/constants';

import BattleGridCursor from './BattleGridCursor';
import BattleGridExplosion from './BattleGridExplosion';
import BattleGridHits from './BattleGridHits';
import BattleGridMisses from './BattleGridMisses';
import BattleGridUnknowns from './BattleGridUnknowns';
import BattleGridBackgroundCells from "@/components/BattleGrid/BattleGridBackgoundCells";


export default function BattleGridCanvas() {
    return (
        <Stage
            width={HEX_WIDTH * COLS + HEX_GRID_MARGIN * 1.5}
            height={HEX_HEIGHT * ROWS * 0.75 + HEX_GRID_MARGIN}
            options={{
                backgroundAlpha: 0,
                antialias: true,
                resolution: 2,
                autoDensity: true,
            }}
        >
            <Container>
                <BattleGridBackgroundCells />
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
