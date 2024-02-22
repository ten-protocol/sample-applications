// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract BattleshipGame {
  uint256 public entryFee;
  bool gameStarted = false;
  uint256 constant gridSize = 50;
  uint256 constant shipSize = 3;
  uint256 constant totalShips = 3;
  struct Ship {
    uint256 startX;
    uint256 startY;
    bool horizontal;
    bool sunk;
    bool[shipSize] hitParts;
  }
  Ship[totalShips] public ships;
  int256[gridSize][gridSize] public board;

  uint256 public hitRewardPercentage = 1;
  uint256 public sinkRewardPercentage = 5;

  mapping(address => uint256) public playerHits;
  mapping(address => uint256) public playerSinks;

  address[] public players;

  uint256 public rewardPool = 0;

  struct Winner {
    address playerAddress;
    uint256 hits;
    uint256 sinks;
  }

  Winner[] public winners;

  event ShipHit(uint256 x, uint256 y);
  event ShipMiss(uint256 x, uint256 y);
  event ShipSunk(uint256 shipIndex);
  event GameWon(address winner);

  constructor(uint256 _entryFee) {
    entryFee = _entryFee;
    for (uint256 i = 0; i < gridSize; i++) {
      for (uint256 j = 0; j < gridSize; j++) {
        board[i][j] = -1;
      }
    }
    placeShips();
  }

  function joinGame() public payable {
    require(msg.value == entryFee, 'Incorrect entry fee');
    require(!gameStarted, 'Game already in progress');

    players.push(msg.sender);
    rewardPool += msg.value;
  }

  function placeShips() internal {
    uint256 attempts;
    uint256 maxAttempts = 100;
    for (uint256 i = 0; i < totalShips; i++) {
      bool placed = false;
      attempts = 0;
      while (!placed && attempts < maxAttempts) {
        attempts++;
        uint256 x = uint256(
          keccak256(abi.encodePacked(block.timestamp, block.difficulty, attempts))
        ) % (gridSize - shipSize + 1);
        uint256 y = uint256(
          keccak256(abi.encodePacked(blockhash(block.number - 1), block.timestamp, attempts))
        ) % (gridSize);
        bool horizontal = uint256(
          keccak256(abi.encodePacked(block.difficulty, block.timestamp, attempts))
        ) %
          2 ==
          0;

        bool[shipSize] memory hitParts;
        for (uint256 j = 0; j < shipSize; j++) {
          hitParts[j] = false;
        }

        if (canPlaceShip(x, y, horizontal)) {
          ships[i] = Ship(x, y, horizontal, false, hitParts);
          markShipOnBoard(i, x, y, horizontal);
          placed = true;
        }
      }
      require(placed, 'Failed to place all ships');
    }
  }

  function canPlaceShip(uint256 x, uint256 y, bool horizontal) internal view returns (bool) {
    for (uint256 i = 0; i < shipSize; i++) {
      uint256 checkX = x + (horizontal ? i : 0);
      uint256 checkY = y + (horizontal ? 0 : i);

      if (checkX >= gridSize || checkY >= gridSize || board[checkX][checkY] != -1) {
        return false;
      }
    }
    return true;
  }

  function markShipOnBoard(uint256 shipIndex, uint256 x, uint256 y, bool horizontal) internal {
    for (uint256 i = 0; i < shipSize; i++) {
      uint256 markX = x + (horizontal ? i : 0);
      uint256 markY = y + (horizontal ? 0 : i);
      board[markX][markY] = int256(shipIndex);
    }
  }

  function takeShot(uint256 x, uint256 y) public {
    require(gameStarted, 'Game has not started');
    require(x < gridSize && y < gridSize, 'Coordinates out of bounds');

    if (board[x][y] >= 0) {
      uint256 shipIndex = uint256(board[x][y]);
      Ship storage ship = ships[shipIndex];
      uint256 hitPart = ship.horizontal ? (x - ship.startX) : (y - ship.startY);

      require(!ship.hitParts[hitPart], 'Part already hit');

      ship.hitParts[hitPart] = true;
      playerHits[msg.sender] += 1;

      emit ShipHit(x, y);

      if (isShipSunk(ship)) {
        ship.sunk = true;
        playerSinks[msg.sender] += 1;
        emit ShipSunk(shipIndex);
      }
    } else {
      emit ShipMiss(x, y);
    }

    checkGameCompletion();
  }

  function updateWinner(address playerAddress, bool isHit, bool isSink) internal {
    for (uint256 i = 0; i < winners.length; i++) {
      if (winners[i].playerAddress == playerAddress) {
        if (isHit) winners[i].hits += 1;
        if (isSink) winners[i].sinks += 1;
        return;
      }
    }
    winners.push(Winner(playerAddress, isHit ? 1 : 0, isSink ? 1 : 0));
  }

  function isShipSunk(Ship memory ship) internal pure returns (bool) {
    for (uint256 i = 0; i < shipSize; i++) {
      if (!ship.hitParts[i]) {
        return false;
      }
    }
    return true;
  }

  function checkGameCompletion() internal {
    uint256 sunkShips = 0;
    for (uint256 i = 0; i < totalShips; i++) {
      if (ships[i].sunk) {
        sunkShips += 1;
      }
    }
    if (sunkShips == totalShips) {
      gameStarted = false;
      distributePrizes();
    }
  }

  function distributePrizes() internal {
    uint256 totalHits = 0;
    uint256 totalSinks = 0;

    for (uint256 i = 0; i < players.length; i++) {
      totalHits += playerHits[players[i]];
      totalSinks += playerSinks[players[i]];
    }

    uint256 totalDistributed = 0;

    for (uint256 i = 0; i < players.length; i++) {
      uint256 playerReward = 0;
      if (totalHits > 0) {
        playerReward +=
          (playerHits[players[i]] * rewardPool * hitRewardPercentage) /
          (100 * totalHits);
      }
      if (totalSinks > 0) {
        playerReward +=
          (playerSinks[players[i]] * rewardPool * sinkRewardPercentage) /
          (100 * totalSinks);
      }

      playerReward = playerReward > address(this).balance ? address(this).balance : playerReward;
      totalDistributed += playerReward;

      if (playerReward > 0) {
        payable(players[i]).transfer(playerReward);
      }
    }

    if (totalDistributed > rewardPool) {
      rewardPool = 0;
    } else {
      rewardPool -= totalDistributed;
    }

    resetGame();
  }

  function resetGame() internal {
    for (uint256 i = 0; i < players.length; i++) {
      delete playerHits[players[i]];
      delete playerSinks[players[i]];
    }

    delete players;

    for (uint256 i = 0; i < gridSize; i++) {
      for (uint256 j = 0; j < gridSize; j++) {
        board[i][j] = -1;
      }
    }

    for (uint256 i = 0; i < totalShips; i++) {
      ships[i].sunk = false;
      for (uint256 j = 0; j < shipSize; j++) {
        ships[i].hitParts[j] = false;
      }
    }
    placeShips();

    gameStarted = true;
  }
}
