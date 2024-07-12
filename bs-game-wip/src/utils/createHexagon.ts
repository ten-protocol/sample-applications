import * as PIXI from "pixi.js";

export default function createHexagon(width, height) {
  const hex = new PIXI.Polygon([
    0,
    -height / 2,
    width / 2,
    -height / 4,
    width / 2,
    height / 4,
    0,
    height / 2,
    -width / 2,
    height / 4,
    -width / 2,
    -height / 4,
  ]);
  return hex;
}
