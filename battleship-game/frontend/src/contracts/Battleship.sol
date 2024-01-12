// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Battleship {
    uint public constant GRID_SIZE = 20;
    uint public constant MAX_SHIPS_PER_PLAYER = 3;
    uint public constant SHIP_SIZE = 3;
    uint256 private shipIDCounter = 1; // start with 1 to know when it is empty or not.

    // TODO: Currently each ship is of size 3
    struct Ship {
        uint position;
        bool isVertical; // position is top of the boat if vertical and left if horizontal
        bool[3] hits;
        address owner;
        uint256 shipID;
    }

    struct Player {
        uint256[MAX_SHIPS_PER_PLAYER] ships;
        uint shipCount;
        bool isAlive;
    }

    mapping(address => Player) public players;

    // position -> ship id
    mapping(uint => uint256) private world;

    // shipId -> ship structure
    mapping(uint256 => Ship) private ships;

    // Event to represent invalid placement
    event InvalidShipPlacement(address player, uint position);

    // Event that is emitted when a player joins the game
    event PlayerJoined(address player);

    // Event that is emitted when a player shoots
    event PlayerShoots(address player, uint position, uint hit); // 0 is a miss, 1 is hit already destroyed part of ship, 2 is new hit

    // Event that is emitted when a player places a new boat
    event PlayerAddsABoat(address player, uint position, bool isVertical);

    // Event that is emitted when a ship is sunk
    event ShipSunk(address player, uint256 shipID);

    // Player tries to join the game. Initialize their data
    // Player joins the game. This can be called multiple times to add ships, up to MAX_SHIPS_PER_PLAYER.
    function joinGame() private {
        if (players[msg.sender].isAlive) {
            return;
        }
        // require(!players[msg.sender].isAlive, "Player is already in the game");

        // Initialize player state
        players[msg.sender].isAlive = true;
        players[msg.sender].shipCount = 0;

        emit PlayerJoined(msg.sender);
    }

    // Player joins the game
    function placeAShip(uint _position, bool _isVertical) public {
        joinGame();

        require(players[msg.sender].isAlive, "Player must join the game first");
        require(
            players[msg.sender].shipCount < MAX_SHIPS_PER_PLAYER,
            "Player has already placed the maximum number of ships"
        );

        // check if placement is valid
        require(
            isValidPlacement(_position, _isVertical),
            "Invalid ship position"
        );

        // create and implement new shipID
        uint256 newShipID = shipIDCounter;
        shipIDCounter = shipIDCounter + 1;

        // place new ship in a mapping
        ships[newShipID] = Ship({
            position: _position,
            isVertical: _isVertical,
            hits: [false, false, false],
            owner: msg.sender,
            shipID: newShipID
        });

        // Add shipID to player's list of ships
        players[msg.sender].ships[players[msg.sender].shipCount] = newShipID;
        players[msg.sender].shipCount++;

        // get positions of the ship
        uint[3] memory shipPositions = getShipPositions(newShipID);

        // place a ship in the world
        for (uint i = 0; i < shipPositions.length; i++) {
            world[shipPositions[i]] = newShipID;
            // console.log("Placing ship to ", shipPositions[i], " with shipID: ", newShipID);
        }

        emit PlayerAddsABoat(msg.sender, _position, _isVertical);
    }

    // only for ships of size 3
    function getShipPositions(
        uint256 shipID
    ) private view returns (uint[3] memory) {
        Ship storage s = ships[shipID];
        if (s.isVertical) {
            return [
                s.position,
                s.position + GRID_SIZE,
                s.position + 2 * GRID_SIZE
            ];
        } else {
            return [s.position, s.position + 1, s.position + 2];
        }
    }

    // Check if the placement is valid (we need to check if whole ship is in a grid and
    function isValidPlacement(
        uint position,
        bool isVertical
    ) private view returns (bool) {
        // TODO: add ship size if we want different sizes of ships
        // check if the whole ship is inside the grid

        // it is vertical and it is outside of the grid -> return false
        if (
            isVertical &&
            ((position + (SHIP_SIZE - 1) * GRID_SIZE) >= GRID_SIZE * GRID_SIZE)
        ) {
            // check if the last part of the ship is outside the grid
            return false;
        }

        // it is horizontal and it is outside of the frid -> return false
        if (
            !isVertical && (position % GRID_SIZE) + (SHIP_SIZE - 1) >= GRID_SIZE
        ) {
            return false;
        }

        // check all the positions if there is a ship already there
        if (isVertical) {
            for (uint i = 0; i < SHIP_SIZE - 1; i++) {
                if (world[position + i * GRID_SIZE] != 0) {
                    return false;
                }
            }
        }

        if (!isVertical) {
            for (uint i = 0; i < SHIP_SIZE - 1; i++) {
                if (world[position + i] != 0) {
                    return false;
                }
            }
        }

        return true;
    }

    function isShipDestroyed(uint256 shipID) private view returns (bool) {
        Ship storage ship = ships[shipID];
        for (uint i = 0; i < ship.hits.length; i++) {
            if (!ship.hits[i]) {
                return false;
            }
        }
        return true;
    }

    function Shoot(uint position) public payable returns (bool) {
        // check if there is a ship at desired position
        if (world[position] != 0) {
            // we hit a ship
            // check if this part of the ship was hit before
            bool newHitOnAShip = ShipHit(world[position], position);
            // console.log("Is it a new hit: ", newHitOnAShip);
            emit PlayerShoots(msg.sender, position, newHitOnAShip ? 2 : 1);
            return true;
        } else {
            // console.log("missed");
            emit PlayerShoots(msg.sender, position, 0);
        }

        return false;
    }

    // returns true if we hit a part of a ship that was not hit before and false if we hit already hitted part
    function ShipHit(uint256 shipID, uint position) private returns (bool) {
        uint[3] memory shipPositions = getShipPositions(shipID);

        // check which part of ship was hit
        for (uint i = 0; i < shipPositions.length; i++) {
            if (position == shipPositions[i]) {
                // get info where the ship was hit and change its status
                Ship storage ship = ships[shipID];

                // check if hit part of the ship was hit before (we don't count it as a hit)
                if (ship.hits[i]) {
                    return false;
                }

                ship.hits[i] = true;
                break;
            }
        }

        // check if a ship is destroyed
        if (isShipDestroyed(shipID)) {
            // console.log("SHIP IS DESTROYED!");
            Ship storage ship = ships[shipID];
            emit ShipSunk(ship.owner, ship.shipID);

            for (uint i = 0; i < shipPositions.length; i++) {
                delete world[shipPositions[i]];
            }
            delete ships[shipID];
        }

        return true;
    }
}
