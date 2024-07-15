import { MouseEvent, useEffect, useRef } from 'react';

import { COLS, CONTAINER_HEIGHT, ROWS } from '@/lib/constants';
import { useBattleGridStore } from '@/stores/battleGridStore';

import BattleGridCanvas from './BattleGridCanvas';

const styles = {
    container: {
        width: '100%',
        height: CONTAINER_HEIGHT + 'px',
        overflow: 'auto',
    },
};

export default function BattleGridContainer() {
    const setMousePosition = useBattleGridStore((state) => state.setMousePosition);
    const initGrid = useBattleGridStore((state) => state.initGrid);
    const grid = useBattleGridStore((state) => state.grid);
    const selectCell = useBattleGridStore((state) => state.selectCell);

    useEffect(() => {
        initGrid(COLS, ROWS);
    }, []);

    const elementRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (event: MouseEvent) => {
        if (elementRef?.current) {
            const rect = elementRef.current.getBoundingClientRect();
            const scrollLeft = elementRef.current.scrollLeft;
            const scrollTop = elementRef.current.scrollTop;

            const x = event.clientX - rect.left + scrollLeft;
            const y = event.clientY - rect.top + scrollTop;
            setMousePosition(x, y);
        }
    };

    const handleMouseClick = () => {
        selectCell();
    };

    return (
        <div
            ref={elementRef}
            style={styles.container}
            onMouseMove={handleMouseMove}
            onClick={handleMouseClick}
        >
            <BattleGridCanvas grid={grid} width={COLS} height={ROWS} />
        </div>
    );
}
