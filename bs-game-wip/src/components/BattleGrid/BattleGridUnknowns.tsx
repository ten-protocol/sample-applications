import { useMemo } from 'react';

import { Container, Graphics, Text } from '@pixi/react';
import { TextStyle } from 'pixi.js';

import drawGridCells from '@/helpers/drawGridCells';
import { useGameStore } from '@/stores/gameStore';

const style = new TextStyle({ fontSize: 12, fill: 0xffffff });

export default function BattleGridUnknowns() {
    const unknownCells = useGameStore((state) => state.unknownCells);

    const gridCells = useMemo(
        () => <Graphics draw={(g) => drawGridCells(g, unknownCells, 'UNKNOWN')} />,
        [unknownCells, unknownCells]
    );

    const questionMarks = useMemo(
        () =>
            unknownCells.map(({ x, y }) => (
                <Text
                    key={`${x}_${y}`}
                    text="?"
                    style={style}
                    x={x}
                    y={y}
                    anchor={0.5} // Anchor the text to the center
                />
            )),
        [unknownCells]
    );

    if (unknownCells.length === 0) {
        return null;
    }

    return (
        <Container>
            {gridCells}
            {questionMarks}
        </Container>
    );
}
