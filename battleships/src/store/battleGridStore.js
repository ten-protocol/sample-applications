import { defineStore } from 'pinia'
import {
    SHIP_LENGTH,
    GRID_SIZE,
    STATE_HOVER_SHOOT,
    STATE_HOVER_PLACE,
    STATE_NEUTRAL,
    STATE_SHOT,
    STATE_SHIP,
    ORIENTATION_HORIZONTAL
} from "@/lib/constants.js";

function getShipCoordinates(row, col, orientation, length) {
    const coordinates = [];
    for (let i = 0; i < length; i++) {
        if (orientation === ORIENTATION_HORIZONTAL) {
            if (col + i >= GRID_SIZE) {
                return []; // out of bounds
            }
            coordinates.push(`${row},${col + i}`);
        } else {
            if (row + i >= GRID_SIZE) {
                return []; // out of bounds
            }
            coordinates.push(`${row + i},${col}`);
        }
    }
    return coordinates;
}

export const useBattleGridStore = defineStore('battleGrid', {
    // State is a function that returns an object
    state: () => ({
        cellsMap: {}, // a sparse map of actual cell state keyed off of "x,y" string
        hoverCells: {} // a sparse map of highlighted cells keyed off of "x,y" string, overlaid on top of cellsMap
    }),
    // Getters are  like computed properties for stores
    getters: {
        // You could add getters here if you need to compute derived state
        getCellRenderState: (state) => {
            return (row, col) => {
                return state.cellsMap[`${row},${col}`] || state.hoverCells[`${row},${col}`] || STATE_NEUTRAL;
            }
        },
    },
    // Actions can be asynchronous and are where you define methods to change state
    actions: {
        shoot(row, col) {
            this.cellsMap[`${row},${col}`] = STATE_SHOT;
        },
        place(row, col, orientation) {
            const coordinates = getShipCoordinates(row, col, orientation, SHIP_LENGTH);
            coordinates.forEach((coordinate) => {
                this.cellsMap[coordinate] = STATE_SHIP;
            });
        },
        hoverShoot(row, col) {
            this.hoverCells[`${row},${col}`] = STATE_HOVER_SHOOT;
        },
        hoverPlace(row, col, orientation) {
            const coordinates = getShipCoordinates(row, col, orientation, SHIP_LENGTH);
            // check if map already has something there
            for (const coordinate of coordinates) {
                if (this.cellsMap[coordinate]) {
                    return; // something already placed here, bail out
                }
            }
            // set hover state for cells
            coordinates.forEach((coordinate) => {
                this.hoverCells[coordinate] = STATE_HOVER_PLACE;
            });
        },
        clearHovers() {
            this.hoverCells = {}
        }
    }
})
