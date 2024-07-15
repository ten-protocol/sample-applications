import { Graphics as PixiGraphics } from '@pixi/graphics';

import { HEX_HEIGHT, HEX_WIDTH } from '@/lib/constants';
import { RevealedCellType } from '@/stores/battleGridStore';

import createHexagon from './createHexagon';

export default function drawGridCells(
    g: PixiGraphics,
    cells: { x: number; y: number }[],
    state?: RevealedCellType
) {
    g.clear();
    g.position.set(0, 0);
    cells.forEach(({ x, y }) => {
        if (!state) {
            g.lineStyle(1, 0x464646, 1);
        }
        if (state === 'MISS') {
            g.beginFill(0x5a5a5a, 1);
            g.lineStyle(1, 0x4f4f4f, 1);
        }
        if (state === 'HIT') {
            g.beginFill(0xe16f6f, 1);
            g.lineStyle(1, 0xe16f6f, 1);
        }
        if (state === 'UNKNOWN') {
            g.beginFill(0xffffff, 0.05);
            g.lineStyle(1, 0xffffff, 0.3);
        }

        g.drawPolygon(createHexagon(HEX_WIDTH, HEX_HEIGHT, x, y));
    });
}
