import { StateCreator, create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import getCellCoordsFromXY from '@/helpers/getCellCoordsFromXY';
import getCellXY from '@/helpers/getCellXY';
import getIndexFromCoords from '@/helpers/getIndexFromCoords';

import { useContractStore } from './contractStore';

export type Cell = {
    row: number;
    col: number;
    x: number;
    y: number;
};

export type RevealedCellType = 'HIT' | 'MISS' | 'UNKNOWN';

export type BattleGridState = {
    grid: Cell[];
    missedCells: Cell[];
    hitCells: Cell[];
    unknownCells: Cell[];
    revealedCells: { [key: string]: RevealedCellType };
    hoveredCell: Cell | null;
    scrollPosition: [number, number];
    mousePosition: [number, number];
    selectedCell: Cell | null;
};

export type BattleGridActions = {
    initGrid: (height: number, width: number) => void;
    setMousePosition: (x: number, y: number) => void;
    selectCell: () => void;
    setRevealedCells: (cells: [col: number, row: number][], type: RevealedCellType) => void;
    setSingleRevealedCell: (x: number, y: number, type: RevealedCellType) => void;
    addUnknownCell: (x: number, y: number) => void;
    clearUnknownCells: () => void;
};

export type BattleGridStore = BattleGridState & BattleGridActions;

export const useBattleGridStore = create<BattleGridStore>(
    persist(
        (set, get) => ({
            grid: [],
            missedCells: [],
            hitCells: [],
            unknownCells: [],
            revealedCells: {},
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
                            hexagons.push({ row, col, x, y });
                        }
                    }

                    return { grid: hexagons };
                }),

            setMousePosition: (x: number, y: number) =>
                set((state) => {
                    const guessState = useContractStore.getState().guessState;

                    if (guessState !== 'IDLE') return {};

                    // const [sx, sy] = getSnappedMousePosition(x, y);
                    const [col, row] = getCellCoordsFromXY(x, y);
                    const hoveredCell = state.grid[getIndexFromCoords(col, row)];
                    const isRevealed = !!state.revealedCells[`${col}_${row}`];

                    if (!hoveredCell || isRevealed) return {};

                    return {
                        hoveredCell: hoveredCell || null,
                        mousePosition: [hoveredCell.x, hoveredCell.y],
                    };
                }),

            selectCell: () => {
                const selectedCell = get().hoveredCell;
                if (!selectedCell || useContractStore.getState().guessState !== 'IDLE') return;

                set({ selectedCell });
                const submitGuess = useContractStore.getState().submitGuess;
                submitGuess(selectedCell.col, selectedCell.row);
                // useContractStore.setState({lastGuessCoords: [selectedCell.x, selectedCell.y]});
            },

            setRevealedCells: (
                cells: [col: number, row: number][],
                type: 'HIT' | 'MISS' | 'UNKNOWN'
            ) => {
                const newRevealedCells = { ...get().revealedCells };
                for (let i = 0; i < cells.length; i++) {
                    const key = `${cells[i][0]}_${cells[i][1]}`;
                    if (!newRevealedCells[key] || newRevealedCells[key] === 'UNKNOWN') {
                        newRevealedCells[key] = type;
                    }
                }

                set({ revealedCells: newRevealedCells });
            },

            setSingleRevealedCell: (x: number, y: number, type: 'HIT' | 'MISS' | 'UNKNOWN') => {
                const newRevealedCells = { ...get().revealedCells };
                newRevealedCells[`${x}_${y}`] = type;
                set({ revealedCells: newRevealedCells });
            },

            addUnknownCell: (x: number, y: number) =>
                set((state) => {
                    state.setSingleRevealedCell(x, y, 'UNKNOWN');

                    return { unknownCells: [...state.unknownCells, { ...state.hoveredCell }] };
                }),

            clearUnknownCells: () => set({ unknownCells: [] }),
        }),
        {
            name: 'battle-grid-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: ({ hitCells, missedCells, revealedCells, unknownCells }) => ({
                hitCells,
                missedCells,
                revealedCells,
                unknownCells,
            }),
        }
    ) as StateCreator<BattleGridStore, [], []>
);
