import formatAddress from '@/helpers/formatAddress';
import createHexagon from '@/utils/createHexagon';

export const MOVE_FEE: string = '0.0443';
export const TOTAL_SHIPS: number = 249;
export const HEX_WIDTH = 32;
export const HEX_HEIGHT = 32;
export const VERTICAL_OFFSET = 8;
export const HORIZONTAL_OFFSET = 0;
export const hexHitArea = createHexagon(HEX_WIDTH, HEX_HEIGHT);
export const DRAW_THRESHOLD = 100;
export const CONTAINER_WIDTH = 600;
export const CONTAINER_HEIGHT = 500;
export const COLS = 100;
export const ROWS = 100;
export const HEX_GRID_MARGIN = 32;

export const QUERY_INTERVAL_MS = 5000;
