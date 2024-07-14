import { HEX_GRID_MARGIN, HEX_HEIGHT, HEX_WIDTH, VERTICAL_OFFSET } from '@/lib/constants';

import getSnappedMousePosition from './getSnappedMousePosition';

export default function getCellCoordsFromXY(x: number, y: number) {
    const [sx, sy] = getSnappedMousePosition(x, y);
    const row = (sy - HEX_GRID_MARGIN) / (HEX_HEIGHT - VERTICAL_OFFSET);
    const col = (sx - (HEX_GRID_MARGIN + (row % 2) * (HEX_WIDTH / 2))) / HEX_WIDTH;

    return [col, row];
}
