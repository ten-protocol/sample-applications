<template>
  <div class="game-container">
    <div class="game-controls">
      <div class="grid-map">
        <div class="grid">
          <div
            v-for="(cell, index) in cells"
            :key="index"
            :class="calculateCellClass(cell)"
            :data-row="getRow(index)"
            :data-col="getCol(index)"
            @click="clickCell($event, cell)"
            @mouseenter="hoverCell($event, cell)"
            @mouseleave="clearHover($event, cell)"
          ></div>
        </div>
      </div>

      <div class="user-controls">
        <div class="control-elements">
          <h4>Battle Command</h4>
          <el-radio-group v-model="userMode">
            <el-radio-button label="shoot">Shoot!</el-radio-button>
            <el-radio-button label="place">Place a ship</el-radio-button>
          </el-radio-group>

          <div class="place-controls" v-if="userMode === 'place'">
            <p>Choose ship orientation:</p>
            <el-radio-group v-model="shipOrientation">
              <el-radio-button label="horizontal">Horizontal</el-radio-button>
              <el-radio-button label="vertical">Vertical</el-radio-button>
            </el-radio-group>
          </div>
        </div>

        <div class="game-log">
          <message-log />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import bannerImg from "@/assets/banner.png";
import { useMessageStore } from "@/store/messageStore.js";
import MessageLog from "@/components/MessageLog.vue";
import { useContractStore } from "@/store/contractStore.js"; // Adjust the path if necessary
import { useEventStore } from "@/store/eventStore.js"; // Adjust the path if necessary
import { useBattleGridStore } from "@/store/battleGridStore.js";
import {
  GRID_SIZE,
  STATE_HOVER_SHOOT,
  STATE_HOVER_PLACE,
  STATE_SHIP,
  STATE_SHOT,
} from "@/lib/constants.js";

const STATE_CSS_CLASSES = {
  [STATE_HOVER_SHOOT]: "highlight shoot",
  [STATE_HOVER_PLACE]: "highlight place",
  [STATE_SHIP]: "ship",
  [STATE_SHOT]: "shot",
};

export default {
  name: "BattleshipMap",
  components: { MessageLog },
  setup() {
    return { bannerImg };
  },
  async mounted() {
    const eventStore = useEventStore();
    await eventStore.fetchTransactions();
  },
  data() {
    const cells = [];
    for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
      cells.push({
        row: this.getRow(i),
        col: this.getCol(i),
      });
    }
    return {
      cells,
      gameLog: [],
      userMode: "shoot", // default mode
      shipOrientation: "horizontal", // default orientation
    };
  },
  methods: {
    getRow(index) {
      return Math.floor(index / GRID_SIZE);
    },
    getCol(index) {
      return index % GRID_SIZE;
    },
    calculateCellClass(cell) {
      const battleGridStore = useBattleGridStore();
      let cellRenderState = battleGridStore.getCellRenderState(
        cell.row,
        cell.col
      );
      return `cell ${STATE_CSS_CLASSES[cellRenderState]}`;
    },
    async clickCell(event, cell) {
      const messageLogStore = useMessageStore();
      const battleGridStore = useBattleGridStore();
      const contractStore = useContractStore();

      if (this.userMode === "shoot") {
        messageLogStore.addMessage(
          `Shoot at - Row: ${cell.row} Column ${cell.col}`
        );
        await contractStore.shoot(cell.row, cell.col);
        battleGridStore.shoot(cell.row, cell.col);
      } else if (this.userMode === "place") {
        messageLogStore.addMessage(
          `Added Boat at - Row: ${cell.row} Column ${cell.col}`
        );
        await contractStore.placeShip(cell.row, cell.col, this.shipOrientation);
        battleGridStore.place(cell.row, cell.col, this.shipOrientation);
      }
    },
    hoverCell(event, cell) {
      const battleGridStore = useBattleGridStore();
      if (this.userMode === "shoot") {
        battleGridStore.hoverShoot(cell.row, cell.col);
      } else if (this.userMode === "place") {
        battleGridStore.hoverPlace(cell.row, cell.col, this.shipOrientation);
      }
    },
    clearHover(event, cell) {
      const battleGridStore = useBattleGridStore();
      battleGridStore.clearHovers();
    },
  },
};
</script>

<style scoped>
.game-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: 100%;
  max-width: 100%;
  padding: 1rem;
}

.game-controls {
  display: flex;
  flex-direction: row;
  gap: 8px;
}

.user-controls {
  width: 100%;
  border-radius: 6px;
  border: 1px solid darkslategrey;
  background-color: slategray;
  padding: 1rem;
  max-height: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
  justify-content: space-between;
}

.grid-map {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin: 0 auto; /* Center the grid map horizontally */
}

.grid {
  display: grid;
  grid-template-columns: repeat(20, 1fr); /* Creates a 20x20 grid */
  grid-gap: 0;
  width: 50rem;
  height: 50rem;
}

.cell {
  width: 100%; /* Each cell takes up 100% of the column width */
  padding-bottom: 20%; /* Padding to maintain aspect ratio */
  background-color: #eee; /* Default cell background color */
  border: 1px solid #ccc; /* Cell border */
  box-sizing: border-box;
  cursor: pointer;
  /*transition: background-color 0.3s; /* Smooth transition for background color */
}

.cell.highlight.shoot {
  background-color: red; /* Cell background color on hover */
}
.cell.highlight.place {
  background-color: darkslategrey; /* Cell background color on hover */
}
.cell.ship {
  background-color: darkolivegreen; /* Cell background color on hover */
}
.cell.shot {
  background-color: darkred; /* Cell background color on hover */
}
</style>
