import { Graphics, Text } from '@pixi/react';

import { hexHitArea } from '@/lib/constants';

const textStyle = {
    fill: '#ffffff',
    fontSize: 14,
};

export default function BattleGridCell({ col, row, x, y, state }) {
    return (
        <>
            <Graphics
                key={`${row}-${col}`}
                draw={(g) => {
                    g.position.set(x, y);
                    g.clear();

                    if (state === 'UNTOUCHED') {
                        g.lineStyle(1, 0x464646, 1);
                    }
                    if (state === 'MISSED') {
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

                    g.drawPolygon(hexHitArea);
                    g.endFill();
                }}
            >
                {state === 'UNKNOWN' && (
                    <Text text="?" anchor={0.5} x={0} y={0} style={textStyle} />
                )}
            </Graphics>
        </>
    );
}
