// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract RockPaperScissors {
    address public player1;
    address public player2;
    bool public gameStarted;
    uint256 public player1Choice;
    uint256 public player2Choice;
    address public winner;

    event GameStarted(address player1, address player2);
    event ChoicesSubmitted(address player, uint256 choice);
    event GameResult(address winner);

    modifier onlyPlayers() {
        require(msg.sender == player1 || msg.sender == player2, "You are not a player");
        _;
    }

    modifier gameNotStarted() {
        require(!gameStarted, "Game has already started");
        _;
    }

    modifier gameIsStarted() {
        require(gameStarted, "Game has not started yet");
        _;
    }

    modifier choicesNotSubmitted() {
        require(player1Choice == 0 || player2Choice == 0, "Choices already submitted");
        _;
    }

    function startGame(address _player2) external gameNotStarted {
        require(msg.sender != _player2, "Cannot play with yourself");
        player1 = msg.sender;
        player2 = _player2;
        gameStarted = true;
        emit GameStarted(player1, player2);
    }

    function submitChoice(uint256 _choice) external onlyPlayers gameIsStarted choicesNotSubmitted {
        require(_choice >= 1 && _choice <= 3, "Invalid choice. 1: Rock, 2: Paper, 3: Scissors");

        if (msg.sender == player1) {
            player1Choice = _choice;
        } else {
            player2Choice = _choice;
        }

        emit ChoicesSubmitted(msg.sender, _choice);

        if (player1Choice != 0 && player2Choice != 0) {
            determineWinner();
        }
    }

    function determineWinner() internal {
        if (player1Choice == player2Choice) {
            // It's a draw
            winner = address(0);
        } else if (
            (player1Choice == 1 && player2Choice == 3) ||
            (player1Choice == 2 && player2Choice == 1) ||
            (player1Choice == 3 && player2Choice == 2)
        ) {
            winner = player1;
        } else {
            winner = player2;
        }

        emit GameResult(winner);
    }

    function getWinner() external view gameIsStarted returns (address) {
        return winner;
    }
}
