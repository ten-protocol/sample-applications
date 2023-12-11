// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract GuessingGame {
  uint256 private secretNumber;
  address private owner;
  uint256 public totalGuesses;

  // constants
  uint256 public constant GUESS_FEE = 443e14; // 0.0443 ETH
  uint256 public constant MAX_GUESS = 10;

  event Guessed(address indexed user, uint256 guessedNumber, bool success);

  modifier onlyOwner() {
    require(msg.sender == owner, 'Only the owner can call this function');
    _;
  }

  constructor() {
    owner = msg.sender;
    _resetSecretNumber();
  }

  function guess(uint256 _number) external payable {
    require(_number > 0 && _number <= MAX_GUESS, 'Secret number should be between 1 and 10');
    require(msg.value == GUESS_FEE, 'You need to send 0.443 ETH to make a guess');
    totalGuesses += 1;

    if (_number == secretNumber) {
      // If the guess is correct, transfer all the contract balance to the user
      payable(msg.sender).transfer(address(this).balance);
      emit Guessed(msg.sender, _number, true);
      _resetSecretNumber();
      totalGuesses = 0;
    } else {
      emit Guessed(msg.sender, _number, false);
    }
  }

  function _resetSecretNumber() private {
    uint256 randomNumber = block.prevrandao;
    secretNumber = (randomNumber % MAX_GUESS) + 1;
  }

  function getContractBalance() external view returns (uint256) {
    return address(this).balance;
  }
}
