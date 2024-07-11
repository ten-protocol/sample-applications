import {DRAW_THRESHOLD, HEX_HEIGHT, HEX_WIDTH} from "../lib/constants";

export default function isInViewport (x, y, viewport, scrollPosition) {
    return (
        x > -HEX_WIDTH + scrollPosition[0] - DRAW_THRESHOLD &&
        x < viewport.width + HEX_WIDTH + scrollPosition[0] + DRAW_THRESHOLD &&
        y > -HEX_HEIGHT + scrollPosition[1] &&
        y < viewport.height + HEX_HEIGHT + scrollPosition[1]
    );
};