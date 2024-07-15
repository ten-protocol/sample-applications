import { useMemo } from 'react';

import {Container, Graphics, Text} from '@pixi/react';

import drawGridCells from '@/helpers/drawGridCells';
import { useBattleGridStore } from '@/stores/battleGridStore';
import {TextStyle} from "pixi.js";

const style = new TextStyle({fontSize: 12, fill: 0xffffff})

export default function BattleGridUnknowns() {
    const unknownCells = useBattleGridStore((state) => state.unknownCells);

    const gridCells = useMemo(
        () => <Graphics draw={(g) => drawGridCells(g, unknownCells, 'UNKNOWN')} />,
        [unknownCells, unknownCells]
    );

    const questionMarks = useMemo(() => unknownCells.map(({x, y}) => <Text
        key={`${x}_${y}`}
        text="?"
        style={style}
        x={x}
        y={y}
        anchor={0.5} // Anchor the text to the center
    />), [unknownCells])

    if (unknownCells.length === 0) {
        return null;
    }

    return (
        <Container>
            {gridCells}
            {questionMarks}
        </Container>
    )
}
