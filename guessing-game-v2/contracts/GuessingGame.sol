// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract GuessingGame {
    uint256 private secretNumber;
    address private owner;
    uint256 public totalGuesses;
    mapping(address => uint256) private lastGuess;
    mapping(address => uint256) private lastDifference;

    // constants
    uint256 public constant GUESS_FEE = 443e14; // 0.0443 ETH
    uint256 public constant MAX_GUESS = 1000;
    uint256 private lastResetTime;

    event Guessed(address indexed user, uint256 guessedNumber, bool success, string feedback);

    modifier onlyOwner() {
        require(msg.sender == owner, 'Only the owner can call this function');
        _;
    }

    constructor() {
        owner = msg.sender;
        _setSecretNumber();
    }

function guess(uint256 _number) external payable {
    require(_number > 0 && _number <= MAX_GUESS, 'Secret number should be between 1 and 1000');
    require(msg.value == GUESS_FEE, 'You need to pay a fees of 0.443 ETH to make a guess');
    totalGuesses += 1;

    if (lastResetTime > lastGuess[msg.sender]) {
        lastDifference[msg.sender] = MAX_GUESS + 1;
    }

    uint256 currentDifference = _number > secretNumber ? _number - secretNumber : secretNumber - _number;
    string memory feedback;

    if (_number == secretNumber) {
        payable(msg.sender).transfer(address(this).balance);
        feedback = "correct! You won the prize";
        emit Guessed(msg.sender, _number, true, feedback);
        _setSecretNumber();
        lastResetTime = block.timestamp;
        totalGuesses = 0;
    } else {
        if (lastResetTime > lastGuess[msg.sender]) {
            if (currentDifference < lastDifference[msg.sender]) {
                feedback = "warmer";
            } else if (currentDifference > lastDifference[msg.sender]) {
                feedback = "colder";
            } else {
                feedback = "neither warmer nor colder";
            }
        } else {
            feedback = "first guess, try again!";
        }

        lastGuess[msg.sender] = block.timestamp;
        lastDifference[msg.sender] = currentDifference;
        emit Guessed(msg.sender, _number, false, feedback);
    }
}

    function _setSecretNumber() private {
        uint256 randomNumber = block.difficulty;
        secretNumber = (randomNumber % MAX_GUESS) + 1;
    }

    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
