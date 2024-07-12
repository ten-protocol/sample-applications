import { HEX_GRID_MARGIN, HEX_HEIGHT, HEX_WIDTH, VERTICAL_OFFSET } from '@/lib/constants';

export default function getSnappedMousePosition(x: number, y: number) {
    const snappedY =
        Math.round(y / (HEX_HEIGHT - VERTICAL_OFFSET)) * (HEX_HEIGHT - VERTICAL_OFFSET) +
        HEX_GRID_MARGIN / 4;
    let snappedX = 0;

    if (snappedY % ((HEX_HEIGHT - VERTICAL_OFFSET) * 2) === HEX_GRID_MARGIN) {
        snappedX = Math.round(x / HEX_WIDTH) * HEX_WIDTH;
    } else {
        snappedX = Math.round((x + HEX_WIDTH / 2) / HEX_WIDTH) * HEX_WIDTH - HEX_WIDTH / 2;
    }

    return [snappedX, snappedY];
}
