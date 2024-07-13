import { useRef } from 'react';

import { BloomFilter } from '@pixi/filter-bloom';
import { Container, Graphics, useTick } from '@pixi/react';

import { hexHitArea } from '@/lib/constants';
import { useBattleGridStore } from '@/stores/battleGridStore';
import { useContractStore } from '@/stores/contractStore';

import CellHighlight from '../CellHighlight/CellHighlight';

export default function BattleGridCursor() {
    const [[x, y], hoveredCell] = useBattleGridStore((state) => [
        state.mousePosition,
        state.hoveredCell,
    ]);
    const guessState = useContractStore((state) => state.guessState);
    const isLoadingState = guessState !== 'IDLE';
    const shapeRef = useRef(null);
    const scaleRef = useRef(1);
    const directionRef = useRef(1);
    const timeRef = useRef(0);
    const bloomFilter = new BloomFilter(3, 3, 2);

    useTick((delta) => {
        if (shapeRef.current) {
            timeRef.current += delta;
            const scaleSpeed = 0.1;
            const rotationSpeed = 1;
            const maxScale = 1;
            const minScale = isLoadingState && guessState !== 'ERROR' ? 0.5 : 0.95;
            const scaleRange = (maxScale - minScale) / 2;
            const midScale = (maxScale + minScale) / 2;
            const newScale = midScale + Math.sin(timeRef.current * scaleSpeed) * scaleRange;

            shapeRef.current.scale.set(newScale);

            if (isLoadingState && guessState !== 'ERROR') {
                shapeRef.current.rotation += timeRef.current * rotationSpeed;
            } else {
                shapeRef.current.rotation = 0;
            }
        }
    });

    if (!hoveredCell) {
        return null;
    }

    return (
        <Container filters={[]}>
            <Graphics
                ref={shapeRef}
                draw={(g) => {
                    g.position.set(x, y);
                    g.clear();
                    g.lineStyle(1, guessState !== 'ERROR' ? 0xffffff : 0xdc2626, 1);
                    g.drawPolygon(hexHitArea);
                    g.endFill();
                }}
            />
            <CellHighlight particleCount={20} duration={1000} />
        </Container>
    );
}
