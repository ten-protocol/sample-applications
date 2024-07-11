import {HEX_GRID_MARGIN, HEX_HEIGHT, HEX_WIDTH, HORIZONTAL_OFFSET, VERTICAL_OFFSET} from "../lib/constants";

export default function getCellXY (col: number, row: number) {
    const x = HEX_GRID_MARGIN + (
        ((row % 2) * HEX_WIDTH) / 2 + col * (HEX_WIDTH - HORIZONTAL_OFFSET));
    const y = HEX_GRID_MARGIN + (row * (HEX_HEIGHT - VERTICAL_OFFSET))

    return [x,y]
}