// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract Battleship {
    uint8 constant gridSize = 100;
    uint8 constant totalShips = 249;
    uint8 constant shipLength = 3;
    address public owner;
    mapping(address => bool) public admins;

    struct Position {
        uint8 x;
        uint8 y;
    }

    struct Ship {
        Position start;
        bool[shipLength] hits;
    }

    Ship[totalShips] private ships;
    mapping(uint16 => uint8) private positionToShipIndex;
    mapping(uint16 => bool) public hits;
    Position[] public hitCoordinates;
    uint256 private seed;
    uint256 private nonce = 0;
    uint256 public prizePool;
    bool[totalShips] public graveyard;
    uint8 public sunkShipsCount;
    bool public gameOver;

    constructor() {
        seed = uint256(keccak256(abi.encodePacked(block.difficulty)));
        owner = msg.sender;
        admins[owner] = true;
        generatePositions();
    }

    modifier onlyAdmin() {
        require(admins[msg.sender], "Caller is not an admin");
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not the owner");
        _;
    }

    function addAdmin(address newAdmin) public onlyOwner {
        admins[newAdmin] = true;
    }

    function generatePositions() private {
        uint8 index = 0;
        while (index < totalShips) {
            uint256 hash = uint256(keccak256(abi.encodePacked(seed, nonce)));
            for (uint8 i = 0; i < 36 && index < totalShips; i++) {
                uint8 x = uint8(hash & 0x7F) % gridSize;
                uint8 y = uint8((hash >> 7) & 0x7F) % gridSize;

                if (isPositionUniqueAndFits(x, y)) {
                    ships[index].start = Position(x, y);
                    for (uint8 j = 0; j < shipLength; j++) {
                        uint16 positionKey = packCoordinates(x + j, y);
                        positionToShipIndex[positionKey] = index;
                    }
                    index++;
                }
                hash >>= 14;
            }
            nonce++;
        }
    }

    function isPositionUniqueAndFits(uint8 x, uint8 y) private view returns (bool) {
        if (x + shipLength > gridSize) return false;
        for (uint8 j = 0; j < shipLength; j++) {
            uint16 positionKey = packCoordinates(x + j, y);
            if (positionToShipIndex[positionKey] != 0) {
                return false;
            }
        }
        return true;
    }

    function packCoordinates(uint8 x, uint8 y) private pure returns (uint16) {
        return uint16(x) << 8 | uint16(y);
    }

    function getShipPosition(uint8 shipIndex) public view onlyAdmin returns (Position memory) {
        require(shipIndex < totalShips, "Ship index out of bounds");
        return ships[shipIndex].start;
    }

    function getAllShipPositions() public view onlyAdmin returns (Ship[totalShips] memory) {
        return ships;
    }

    function getShipAtPosition(uint8 x, uint8 y) public view onlyAdmin returns (uint8) {
        uint16 positionKey = packCoordinates(x, y);
        uint8 shipIndex = positionToShipIndex[positionKey];
        require(shipIndex != 0, "No ship at given position");
        return shipIndex;
    }

    function hit(uint8 x, uint8 y) public payable {
        require(!gameOver, "Game is over, no more hits accepted");
        require(msg.value == 0.0443 ether, "Incorrect fee amount");
        uint16 positionKey = packCoordinates(x, y);
        require(!hits[positionKey], "Cell already hit");

        prizePool += msg.value;
        hits[positionKey] = true;
        hitCoordinates.push(Position(x, y));

        uint8 shipIndex = positionToShipIndex[positionKey];
        if (shipIndex != 0) {
            Ship storage ship = ships[shipIndex];
            uint8 hitIndex = x - ship.start.x;
            ship.hits[hitIndex] = true;

            bool allHit = true;
            for (uint8 i = 0; i < shipLength; i++) {
                if (!ship.hits[i]) {
                    allHit = false;
                    break;
                }
            }
            if (allHit) {
                graveyard[shipIndex] = true;
                sunkShipsCount++;
                if (sunkShipsCount == totalShips) {
                    gameOver = true;
                }
            }
        }
    }

    function isHit(uint8 x, uint8 y) public view returns (bool) {
        uint16 positionKey = packCoordinates(x, y);
        return hits[positionKey];
    }

    function isSunk(uint8 shipIndex) public view returns (bool) {
        require(shipIndex < totalShips, "Ship index out of bounds");
        return graveyard[shipIndex];
    }

    function getHitsOnShip(uint8 shipIndex) public view onlyAdmin returns (bool[shipLength] memory) {
        require(shipIndex < totalShips, "Ship index out of bounds");
        return ships[shipIndex].hits;
    }

    function getGraveyard() public view returns (bool[totalShips] memory) {
        return graveyard;
    }

    function getAllHits() public view returns (Position[] memory) {
        return hitCoordinates;
    }
}
