// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract GuessingGameCompetition {
    uint256 private secretNumber;
    uint256 private lastSecretNumber;
    address private owner;
    uint256 public totalGuesses;
    uint256 public resetCount;
    uint256 public roundEndTime;
    uint256 public roundId;

    mapping(address => bool) private admins;
    mapping(address => bool) private whitelistedPlayers;
    mapping(address => mapping(uint256 => uint256)) private playerGuessCounts;

    uint256 public constant GUESS_FEE = 200e14;
    uint256 public constant MAX_GUESS = 1000;
    uint256 private lastResetTime;
    uint256 public maxGuessCount;

    bool private guessingOpen = false;

    event Guessed(address indexed user, uint256 guessedNumber, uint256 currentDifference);
    event RoundStarted(uint256 endTime, uint256 roundId);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    modifier onlyAdmin() {
        require(admins[msg.sender], "Only admins can call this function");
        _;
    }

    constructor(address[] memory _admins) {
        owner = msg.sender;
        admins[owner] = true;
        resetCount = 0;
        _resetSecretNumber();

        for (uint256 i = 0; i < _admins.length; i++) {
            admins[_admins[i]] = true;
        }
    }

    function guess(uint256 _number) external payable {
        require(guessingOpen, "Guessing is not open yet");
        require(block.timestamp < roundEndTime, "Round has ended");
        require(whitelistedPlayers[msg.sender], "Only whitelisted players can make guesses");
        require(_number > 0 && _number <= MAX_GUESS, "Invalid guess");
        require(msg.value == GUESS_FEE, "Incorrect fee");

        uint256 guessCount = playerGuessCounts[msg.sender][roundId];
        require(guessCount < maxGuessCount, "Max guesses reached");

        uint256 currentDifference = (_number > secretNumber)
            ? _number - secretNumber
            : secretNumber - _number;

        playerGuessCounts[msg.sender][roundId]++; // Increment guess count for the current round
        totalGuesses += 1;

        if (_number == secretNumber) {
            payable(msg.sender).transfer(address(this).balance);
            emit Guessed(msg.sender, _number, 0); // 0 means correct guess
            _resetSecretNumber();
            totalGuesses = 0;
        } else {
            emit Guessed(msg.sender, _number, currentDifference);
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

    function startGame(uint256 _roundDuration, uint256 _maxGuessCount) external onlyAdmin {
        require(!guessingOpen, "A round is currently live");

        roundId++; // Increment the round ID
        roundEndTime = block.timestamp + _roundDuration;
        maxGuessCount = _maxGuessCount;
        guessingOpen = true;

        emit RoundStarted(roundEndTime, roundId);
    }

    function bulkWhitelist(address[] calldata _players) external onlyAdmin {
        for (uint256 i = 0; i < _players.length; i++) {
            whitelistedPlayers[_players[i]] = true;
        }
    }

    function closeRound() external onlyAdmin {
        guessingOpen = false;
    }

    /// @notice Returns the last secret number after a reset.
    /// @dev Can only be called if the game has been reset at least once.
    /// @return The last secret number before the current game.
    function getLastSecretNumber() external view returns (uint256) {
        require(resetCount > 0, 'No last secret number available');
        return lastSecretNumber;
    }

    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }

    function isPlayerRegistered(address _player) external view returns (bool) {
        return whitelistedPlayers[_player];
    }

    function addAdmin(address _admin) external onlyOwner {
        admins[_admin] = true;
    }

    function removeAdmin(address _admin) external onlyOwner {
        admins[_admin] = false;
    }

    function isGuessingOpen() external view returns (bool) {
        return guessingOpen;
    }
}