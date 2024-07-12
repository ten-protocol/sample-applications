import { create } from 'zustand';

import getCellXY from '@/helpers/getCellXY';
import getSnappedMousePosition from '@/utils/getSnappedMousePosition';

import { useContractStore } from './contractStore';

export const useBattleGridStore = create((set, get) => ({
    grid: [],
    missedCells: [],
    hitCells: [],
    hoveredCell: null,
    scrollPosition: [0, 0],
    mousePosition: [0, 0],
    selectedCell: null,

    initGrid: (height: number, width: number) =>
        set(() => {
            const hexagons = [];
            for (let row = 0; row < height; row++) {
                for (let col = 0; col < width; col++) {
                    const [x, y] = getCellXY(col, row);
                    hexagons.push({ row, col, x, y, revealed: false });
                }
            }

            return { grid: hexagons };
        }),
    setMousePosition: (x: number, y: number) =>
        set((state) => {
            const guessState = useContractStore.getState().guessState;
            if (guessState !== 'IDLE') return {};

            const [sx, sy] = getSnappedMousePosition(x, y);
            const hoveredCell = state.grid.find((cell) => sx === cell.x && sy === cell.y);

            return {
                hoveredCell: hoveredCell || null,
                mousePosition: getSnappedMousePosition(sx, sy),
            };
        }),

    selectCell: () => {
        const selectedCell = get().hoveredCell;
        if (!selectedCell || useContractStore.getState().guessState !== 'IDLE') return;

        set({ selectedCell });
        const submitGuess = useContractStore.getState().submitGuess;
        submitGuess(selectedCell.col, selectedCell.row);
    },
}));
