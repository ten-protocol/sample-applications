import { COLS } from '@/lib/constants';

export default function getIndexFromCoords(x: number, y: number) {
    return y * COLS + x;
}
