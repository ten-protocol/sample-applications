import * as PIXI from 'pixi.js';

export default function createHexagon(width: number, height: number, x = 0, y = 0) {
    return new PIXI.Polygon([
        x,
        y - height / 2,
        x + width / 2,
        y - height / 4,
        x + width / 2,
        y + height / 4,
        x,
        y + height / 2,
        x - width / 2,
        y + height / 4,
        x - width / 2,
        y - height / 4,
    ]);
}
