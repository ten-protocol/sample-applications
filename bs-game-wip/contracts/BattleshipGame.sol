// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract BattleshipGame {
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
    mapping(uint16 => bool) private hits;
    mapping(uint16 => bool) private misses;
    Position[] private allHits;
    Position[] private allMisses;
    uint256 private seed;
    uint256 private nonce = 0;
    uint256 public prizePool;
    bool[totalShips] public graveyard;
    uint8 public sunkShipsCount;
    bool public gameOver;

    /// @notice Initializes the contract by setting the initial seed and generating ship positions.
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

    /// @notice Emitted when a guess is made.
    /// @param user The address of the user making the guess.
    /// @param guessedCoords The coordinates submitted by the user.
    /// @param success True if the guess hit a ship, false otherwise.
    //TODO: Add comments
    event HitFeedback(address indexed user, uint8[2] guessedCoords, bool success, Position[] allHits, Position[] allMisses, bool[totalShips] graveyard, uint256 prizePool);

    /// @notice Adds a new admin address. Only the owner can add new admins.
    /// @param newAdmin The address of the new admin.
    function addAdmin(address newAdmin) public onlyOwner {
        admins[newAdmin] = true;
    }

    /// @notice Generates unique positions for ships on the grid.
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

    /// @notice Checks if the ship position is unique and fits within the grid.
    /// @param x The x-coordinate of the ship's start position.
    /// @param y The y-coordinate of the ship's start position.
    /// @return bool indicating whether the position is unique and fits within the grid.
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

    /// @notice Packs x and y coordinates into a single uint16 value.
    /// @param x The x-coordinate.
    /// @param y The y-coordinate.
    /// @return uint16 representing the packed coordinates.
    function packCoordinates(uint8 x, uint8 y) private pure returns (uint16) {
        return uint16(x) << 8 | uint16(y);
    }

    /// @notice Gets the position of a specific ship by its index.
    /// @param shipIndex The index of the ship.
    /// @return Position of the ship.
    function getShipPosition(uint8 shipIndex) public view onlyAdmin returns (Position memory) {
        require(shipIndex < totalShips, "Ship index out of bounds");
        return ships[shipIndex].start;
    }

    /// @notice Gets positions of all ships.
    /// @return Array of all ships.
    function getAllShipPositions() public view onlyAdmin returns (Ship[totalShips] memory) {
        return ships;
    }

    /// @notice Gets the index of the ship at a specific grid position.
    /// @param x The x-coordinate of the position.
    /// @param y The y-coordinate of the position.
    /// @return The index of the ship at the specified position.
    function getShipAtPosition(uint8 x, uint8 y) public view onlyAdmin returns (uint8) {
        uint16 positionKey = packCoordinates(x, y);
        uint8 shipIndex = positionToShipIndex[positionKey];
        require(shipIndex != 0, "No ship at given position");
        return shipIndex;
    }

    /// @notice Hits a position on the grid and checks if a ship is hit.
    /// @param x The x-coordinate of the position to hit.
    /// @param y The y-coordinate of the position to hit.
    function hit(uint8 x, uint8 y) public payable {
        require(!gameOver, "Game is over, no more hits accepted");
        require(msg.value == 0.0443 ether, "Incorrect fee amount");
        uint16 positionKey = packCoordinates(x, y);
        require(!hits[positionKey], "Cell already hit");
        require(!misses[positionKey], "Cell already hit");

        prizePool += msg.value;
        bool success;

        uint8 shipIndex = positionToShipIndex[positionKey];
        if (shipIndex != 0) {
            success = true;
            Ship storage ship = ships[shipIndex];
            uint8 hitIndex = x - ship.start.x;
            ship.hits[hitIndex] = true;
            hits[positionKey] = true;
            allHits.push(Position(x, y));
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
        else {
            success = false;
            misses[positionKey] = true;
            allMisses.push(Position(x, y));
        }

        emit HitFeedback(msg.sender, [x, y], success, allHits, allMisses, graveyard, prizePool);
    }


    /// @notice Checks if a specific position on the grid is hit.
    /// @param x The x-coordinate of the position.
    /// @param y The y-coordinate of the position.
    /// @return bool indicating whether the position is hit.
    function isHit(uint8 x, uint8 y) public view returns (bool) {
        uint16 positionKey = packCoordinates(x, y);
        return hits[positionKey];
    }

    /// @notice Checks if a specific ship is sunk.
    /// @param shipIndex The index of the ship.
    /// @return bool indicating whether the ship is sunk.
    function isSunk(uint8 shipIndex) public view returns (bool) {
        require(shipIndex < totalShips, "Ship index out of bounds");
        return graveyard[shipIndex];
    }

    /// @notice Gets the hit status of each part of a specific ship.
    /// @param shipIndex The index of the ship.
    /// @return Array indicating which parts of the ship are hit.
    function getHitsOnShip(uint8 shipIndex) public view onlyAdmin returns (bool[shipLength] memory) {
        require(shipIndex < totalShips, "Ship index out of bounds");
        return ships[shipIndex].hits;
    }

    /// @notice Gets the status of all ships in the graveyard.
    /// @return Array indicating which ships are sunk.
    function getGraveyard() public view onlyAdmin returns (bool[totalShips] memory) {
        return graveyard;
    }

    /// @notice Gets all hit positions so far.
    /// @return Array of positions that have been hit.
    function getAllHits() public view onlyAdmin returns (Position[] memory) {
        return allHits;
    }


    /// @notice Gets all miss positions so far.
    /// @return Array of positions that have been missed.
    function getAllMisses() public view onlyAdmin returns (Position[] memory) {
        return allMisses;
    }
}