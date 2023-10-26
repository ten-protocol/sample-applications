// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract GuessingGame {

    uint256 private secretNumber;
    address private owner;
    uint256 public totalGuesses;
    uint256 public constant GUESS_FEE = 443e15;  // 0.443 ETH

    event Guessed(address indexed user, uint256 guessedNumber, bool success);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    constructor(uint256 _secretNumber) {
        require(_secretNumber > 0 && _secretNumber <= 1000, "Secret number should be between 1 and 1000");
        secretNumber = _secretNumber;
        owner = msg.sender;
    }

    function guess(uint256 _number) external payable {
        require(msg.value == GUESS_FEE, "You need to send 0.443 ETH to make a guess");
        totalGuesses += 1;

        if (_number == secretNumber) {
            // If the guess is correct, transfer all the contract balance to the user
            payable(msg.sender).transfer(address(this).balance);
            emit Guessed(msg.sender, _number, true);
        } else {
            emit Guessed(msg.sender, _number, false);
        }
    }

    function setSecretNumber(uint256 _newSecret) external onlyOwner {
        require(_newSecret > 0 && _newSecret <= 1000, "Secret number should be between 1 and 1000");
        secretNumber = _newSecret;
    }

    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
}