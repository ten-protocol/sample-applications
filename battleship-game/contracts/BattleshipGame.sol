// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract Battleship {
    /// @notice The size of the game grid
    uint8 constant gridSize = 100;

    /// @notice The total number of ships in the game
    uint8 constant totalShips = 249;

    /// @notice The length of each ship
    uint8 constant shipLength = 3;

    /// @notice The address of the contract owner
    address public owner;

    /// @notice Mapping to store admin addresses
    mapping(address => bool) public admins;

    /// @notice Structure representing a position on the grid
    struct Position {
        uint8 x;
        uint8 y;
    }

    /// @notice Structure representing a ship
    struct Ship {
        Position start;
        bool[shipLength] hits;
    }

    /// @notice Array to store all ships
    Ship[totalShips] private ships;

    /// @notice Mapping to store the index of ships based on their position
    mapping(uint16 => uint8) private positionToShipIndex;

    /// @notice Mapping to store hit positions
    mapping(uint16 => bool) public hits;

    /// @notice Array to store hit coordinates
    Position[] public hitCoordinates;

    /// @notice Seed for random position generation
    uint256 private seed;

    /// @notice Nonce for random position generation
    uint256 private nonce = 0;

    /// @notice Prize pool amount in ether
    uint256 public prizePool;

    /// @notice Array to store the status of ships (sunk or not)
    bool[totalShips] public graveyard;

    /// @notice Count of sunk ships
    uint8 public sunkShipsCount;

    /// @notice Game over flag
    bool public gameOver;

    /// @notice Constructor to initialize the contract
    constructor() {
        seed = uint256(keccak256(abi.encodePacked(block.difficulty)));
        owner = msg.sender;
        admins[owner] = true;
        generatePositions();
    }

    /// @notice Modifier to restrict function access to admins only
    modifier onlyAdmin() {
        require(admins[msg.sender], "Caller is not an admin");
        _;
    }

    /// @notice Modifier to restrict function access to the owner only
    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not the owner");
        _;
    }

    /// @notice Add a new admin
    /// @param newAdmin The address of the new admin
    function addAdmin(address newAdmin) public onlyOwner {
        admins[newAdmin] = true;
    }

    /// @notice Generate random positions for the ships
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

    /// @notice Check if a position is unique and fits within the grid
    /// @param x The x-coordinate
    /// @param y The y-coordinate
    /// @return bool Returns true if the position is unique and fits, false otherwise
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

    /// @notice Pack coordinates into a single uint16 value
    /// @param x The x-coordinate
    /// @param y The y-coordinate
    /// @return uint16 The packed coordinates
    function packCoordinates(uint8 x, uint8 y) private pure returns (uint16) {
        return uint16(x) << 8 | uint16(y);
    }

    /// @notice Get the position of a ship
    /// @param shipIndex The index of the ship
    /// @return Position The position of the ship
    function getShipPosition(uint8 shipIndex) public view onlyAdmin returns (Position memory) {
        require(shipIndex < totalShips, "Ship index out of bounds");
        return ships[shipIndex].start;
    }

    /// @notice Get positions of all ships
    /// @return Ship[totalShips] An array of all ships
    function getAllShipPositions() public view onlyAdmin returns (Ship[totalShips] memory) {
        return ships;
    }

    /// @notice Get the index of the ship at a given position
    /// @param x The x-coordinate
    /// @param y The y-coordinate
    /// @return uint8 The index of the ship
    function getShipAtPosition(uint8 x, uint8 y) public view onlyAdmin returns (uint8) {
        uint16 positionKey = packCoordinates(x, y);
        uint8 shipIndex = positionToShipIndex[positionKey];
        require(shipIndex != 0, "No ship at given position");
        return shipIndex;
    }

    /// @notice Register a hit at a given position
    /// @param x The x-coordinate
    /// @param y The y-coordinate
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

    /// @notice Check if a position has been hit
    /// @param x The x-coordinate
    /// @param y The y-coordinate
    /// @return bool Returns true if the position has been hit, false otherwise
    function isHit(uint8 x, uint8 y) public view returns (bool) {
        uint16 positionKey = packCoordinates(x, y);
        return hits[positionKey];
    }

    /// @notice Check if a ship is sunk
    /// @param shipIndex The index of the ship
    /// @return bool Returns true if the ship is sunk, false otherwise
    function isSunk(uint8 shipIndex) public view returns (bool) {
        require(shipIndex < totalShips, "Ship index out of bounds");
        return graveyard[shipIndex];
    }

    /// @notice Get the hit status of a ship
    /// @param shipIndex The index of the ship
    /// @return bool[shipLength] An array representing the hit status of the ship
    function getHitsOnShip(uint8 shipIndex) public view onlyAdmin returns (bool[shipLength] memory) {
        require(shipIndex < totalShips, "Ship index out of bounds");
        return ships[shipIndex].hits;
    }

    /// @notice Get the status of all ships in the graveyard
    /// @return bool[totalShips] An array representing the status of all ships
    function getGraveyard() public view returns (bool[totalShips] memory) {
        return graveyard;
    }

    /// @notice Get all hit coordinates
    /// @return Position[] An array of all hit coordinates
    function getAllHits() public view returns (Position[] memory) {
        return hitCoordinates;
    }
}
