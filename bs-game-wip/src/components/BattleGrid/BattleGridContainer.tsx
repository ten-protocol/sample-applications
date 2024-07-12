import React, { useEffect, useRef } from "react";

import { COLS, CONTAINER_HEIGHT, ROWS } from "@/lib/constants";
import { useBattleGridStore } from "@/stores/battleGridStore";

import BattleGridCanvas from "./BattleGridCanvas";

const styles = {
  container: {
    width: "100%",
    height: CONTAINER_HEIGHT + "px",
    overflow: "auto",
  },
};

export default function BattleGridContainer() {
  const setMousePosition = useBattleGridStore(
    (state) => state.setMousePosition,
  );
  const initGrid = useBattleGridStore((state) => state.initGrid);
  const grid = useBattleGridStore((state) => state.grid);
  const selectCell = useBattleGridStore((state) => state.selectCell);

  // const {handleCellSelection} = useCellSelection()

  useEffect(() => {
    initGrid(COLS, ROWS);
  }, []);

  const lastScrollPosition = useRef({ top: 0, left: 0 });
  const elementRef = useRef(null);

  const handleScroll = () => {
    // if (elementRef.current) {
    //   const newScrollLeft = elementRef.current.scrollLeft;
    //   const newScrollTop = elementRef.current.scrollTop;
    //   if (
    //     Math.abs(newScrollTop - lastScrollPosition.current.top) > threshold ||
    //     Math.abs(newScrollLeft - lastScrollPosition.current.left) > threshold
    //   ) {
    //     setScrollPosition(newScrollLeft, newScrollTop);
    //     lastScrollPosition.current = { top: newScrollTop, left: newScrollLeft };
    //   }
    // }
  };

  const handleMouseMove = (event) => {
    const rect = elementRef.current.getBoundingClientRect();
    const scrollLeft = elementRef.current.scrollLeft;
    const scrollTop = elementRef.current.scrollTop;

    const x = event.clientX - rect.left + scrollLeft;
    const y = event.clientY - rect.top + scrollTop;
    setMousePosition(x, y);
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
      onScroll={handleScroll}
    >
      <BattleGridCanvas grid={grid} width={COLS} height={ROWS} />
    </div>
  );
}
