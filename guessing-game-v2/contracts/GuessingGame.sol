// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

/// @title A guessing game contract where players guess a secret number for a chance to win ETH.
/// @dev This contract uses block difficulty for generating random numbers, which is not secure or truly random.
contract GuessingGame {
    uint256 private secretNumber;
    uint256 private lastSecretNumber;
    address private owner;
    uint256 public totalGuesses;
    uint256 public resetCount;

    mapping(address => bool) private admins;
    mapping(address => uint256) private lastGuess;
    mapping(address => uint256) private lastDifference;
    mapping(address => uint256) private guessCount;
    mapping(address => uint256) private winningGuessCount;

    uint256 public constant GUESS_FEE = 443e14;
    uint256 public constant MAX_GUESS = 1000;
    uint256 private lastResetTime;

    /// @notice Emitted when a guess is made.
    /// @param user The address of the user making the guess.
    /// @param guessedNumber The number guessed by the user.
    /// @param success True if the guess is correct, false otherwise.
    /// @param feedback A message providing feedback on the guess.
    event Guessed(address indexed user, uint256 guessedNumber, bool success, string feedback);

    /// @notice Ensures that only the owner can call the modified function.
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    /// @notice Ensures that only an admin can call the modified function.
    modifier onlyAdmin() {
        require(admins[msg.sender], "Only admins can call this function");
        _;
    }

    /// @dev Sets the deploying address as the owner and initializes the game.
    constructor() {
        owner = msg.sender;
        admins[owner] = true;
        resetCount = 0;
        _resetSecretNumber();
    }

    /// @notice Allows a user to make a guess at the secret number.
    /// @dev Requires a fee; emits a Guessed event with the result.
    /// @param _number The number being guessed by the user.
    function guess(uint256 _number) external payable {
        require(_number > 0 && _number <= MAX_GUESS, "Number must be between 1 and 1000");
        require(msg.value == GUESS_FEE, "Incorrect fee");
        guessCount[msg.sender] += 1;
        totalGuesses += 1;

        string memory feedback;
        uint256 currentDifference = _number > secretNumber ? _number - secretNumber : secretNumber - _number;

        if (lastGuess[msg.sender] == 0 || lastResetTime > lastGuess[msg.sender]) {
            feedback = "First guess, try again!";
        } else {
            if (currentDifference < lastDifference[msg.sender]) {
                feedback = "Your guess is warmer.";
            } else if (currentDifference > lastDifference[msg.sender]) {
                feedback = "Your guess is colder.";
            } else {
                feedback = "Neither warmer nor colder.";
            }
        }

        if (_number == secretNumber) {
            payable(msg.sender).transfer(address(this).balance);
            feedback = "Correct! You won the prize.";
            emit Guessed(msg.sender, _number, true, feedback);
            winningGuessCount[msg.sender] += 1;
            _resetSecretNumber();
            totalGuesses = 0;
        } else {
            lastGuess[msg.sender] = block.timestamp;
            lastDifference[msg.sender] = currentDifference;
            emit Guessed(msg.sender, _number, false, feedback);
        }
    }

    /// @dev Resets the secret number and updates game state.
    function _resetSecretNumber() private {
        if (resetCount > 0) {
            lastSecretNumber = secretNumber;
        }
        uint256 randomNumber = block.difficulty;
        secretNumber = (randomNumber % MAX_GUESS) + 1;
        lastResetTime = block.timestamp;
        resetCount += 1;
    }

    /// @notice Returns the last secret number after a reset.
    /// @dev Can only be called if the game has been reset at least once.
    /// @return The last secret number before the current game.
    function getLastSecretNumber() external view returns (uint256) {
        require(resetCount > 0, "No last secret number available");
        return lastSecretNumber;
    }

    /// @notice Gets the contract's current balance.
    /// @return The balance of the contract in wei.
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }

    /// @notice Adds an admin to the game.
    /// @param _admin The address to be added as an admin.
    function addAdmin(address _admin) external onlyOwner {
        admins[_admin] = true;
    }

    /// @notice Removes an admin from the game.
    /// @param _admin The address to be removed from the admin list.
    function removeAdmin(address _admin) external onlyOwner {
        admins[_admin] = false;
    }

    /// @notice Retrieves the number of guesses made by a specific player.
    /// @param _player The address of the player.
    /// @return The count of guesses made by the player.
    function getGuessCount(address _player) external view onlyAdmin returns (uint256, uint256) {
        return (guessCount[_player], winningGuessCount[_player]);
    }
}
