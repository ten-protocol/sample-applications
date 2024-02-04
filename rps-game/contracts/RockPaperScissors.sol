// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract RockPaperScissors is Ownable {
    address public player1;
    address public player2;
    bool public gameStarted;
    uint256 private player1Choice;
    uint256 private player2Choice;
    address public winner;
    uint256 public gamblingAmount;
    uint256 public commissionPercentage = 4;

    event GameStarted(address player1, address player2, uint256 amount);
    event ChoicesSubmitted(address player, uint256 choice);
    event GameResult(address winner, uint256 commission);
    event WithdrawBalance(address owner, uint256 amount);

    constructor(address initialOwner) Ownable(initialOwner) {}

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

    function startGame(address _player2) external payable gameNotStarted {
        require(msg.sender != _player2, "Cannot play with yourself");
        player1 = msg.sender;
        player2 = _player2;
        gamblingAmount = msg.value;
        gameStarted = true;
        emit GameStarted(player1, player2, gamblingAmount);
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
        uint256 commission = (gamblingAmount * commissionPercentage) / 100;

        if (player1Choice == player2Choice) {
            // It's a draw
            // Refund the gambling amount
            payable(player1).transfer((gamblingAmount - commission) / 2);
            payable(player2).transfer((gamblingAmount - commission) / 2);
        } else if (
            (player1Choice == 1 && player2Choice == 3) ||
            (player1Choice == 2 && player2Choice == 1) ||
            (player1Choice == 3 && player2Choice == 2)
        ) {
            winner = player1;
            payable(winner).transfer((gamblingAmount - commission));
        } else {
            winner = player2;
            payable(winner).transfer((gamblingAmount - commission));
        }

        emit GameResult(winner, commission);
    }

    function getWinner() external view gameIsStarted returns (address) {
        return winner;
    }

    function setCommissionPercentage(uint256 _percentage) external onlyOwner {
        require(_percentage <= 100, "Invalid percentage");
        commissionPercentage = _percentage;
    }

    function withdrawBalance() external onlyOwner {
        uint256 balance = address(this).balance;
        payable(owner()).transfer(balance);
        emit WithdrawBalance(owner(), balance);
    }
}
