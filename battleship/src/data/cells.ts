function generateCells() {
  const cellsArray: string[] = [];
  const alphabet = "ABCDEFGHIJ";

  for (let i = 1; i <= 10; i++) {
    for (let j = 0; j < 10; j++) {
      const cell = `${alphabet[j]}${i}`;
      cellsArray.push(cell);
    }
  }

  return cellsArray;
}

const cells = generateCells();

export default cells;
