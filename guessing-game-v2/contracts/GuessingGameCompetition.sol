// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

/// @title A guessing game contract where players guess a secret number for a chance to win ETH.
/// @dev This contract uses block difficulty for generating random numbers, which is not secure or truly random.
contract GuessingGameCompetition {
  uint256 private secretNumber;
  uint256 private lastSecretNumber;
  address private owner;
  uint256 public totalGuesses;
  uint256 public resetCount;
  uint256 public roundEndTime;
  uint256 public roundDuration;

  struct Player {
    Guess[] guesses;
    uint256 guessCount;
    uint256 lastGuessTime;
  }

  struct Guess {
    uint256 currentDifference;
  }

  struct PlayerLeaderboardEntry {
    address playerAddress;
    uint256[] guessDifferences;
  }

  mapping(address => bool) private admins;
  mapping(address => bool) private whitelistedPlayers;
  mapping(address => Player) private players;
  address[] private whitelistedPlayerList;

  uint256 public constant GUESS_FEE = 200e14;
  uint256 public constant MAX_GUESS = 1000;
  uint256 private lastResetTime;
  uint256 public maxGuessCount;

  bool private guessingOpen = false;

  /// @notice Emitted when a guess is made.
  /// @param user The address of the user making the guess.
  /// @param guessedNumber The number guessed by the user.
  /// @param success True if the guess is correct, false otherwise.
  /// @param feedback A message providing feedback on the guess.
  event Guessed(address indexed user, uint256 guessedNumber, bool success, string feedback);

  /// @notice Emitted when a new round starts.
  /// @param endTime The timestamp when the round ends.
  event RoundStarted(uint256 endTime);

  /// @notice Ensures that only the owner can call the modified function.
  modifier onlyOwner() {
    require(msg.sender == owner, 'Only the owner can call this function');
    _;
  }

  /// @notice Ensures that only an admin can call the modified function.
  modifier onlyAdmin() {
    require(admins[msg.sender], 'Only admins can call this function');
    _;
  }

  /// @dev Sets the deploying address as the owner and initializes the game.
  /// @param _admins An array of addresses to be added as admins.
  constructor(address[] memory _admins) {
    owner = msg.sender;
    admins[owner] = true;
    resetCount = 0;
    _resetSecretNumber();

    for (uint256 i = 0; i < _admins.length; i++) {
      admins[_admins[i]] = true;
    }
  }

  /// @notice Allows a user to make a guess at the secret number.
  /// @dev Requires a fee; emits a Guessed event with the result.
  /// @param _number The number being guessed by the user.
  function guess(uint256 _number) external payable {
    require(guessingOpen, 'Guessing is not open yet');
    require(block.timestamp < roundEndTime, 'Round has ended. Wait for the next round to start.');
    require(whitelistedPlayers[msg.sender], 'Only whitelisted players can make guesses');
    require(_number > 0 && _number <= MAX_GUESS, 'Number must be between 1 and 1000');
    require(msg.value == GUESS_FEE, 'Incorrect fee');
    require(
      players[msg.sender].guessCount < maxGuessCount,
      'You have exhausted your guesses for this round'
    );

    players[msg.sender].guessCount += 1;
    totalGuesses += 1;

    if (_number == secretNumber) {
      players[msg.sender].guesses.push(Guess(0)); // Store 0 for currentDifference
      payable(msg.sender).transfer(address(this).balance);
      emit Guessed(msg.sender, _number, true, 'Correct! You won the prize.');
      _resetSecretNumber();
      totalGuesses = 0;
    } else {
      uint256 currentDifference = _number > secretNumber
        ? _number - secretNumber
        : secretNumber - _number;
      players[msg.sender].guesses.push(Guess(currentDifference)); // Store the current difference
      emit Guessed(msg.sender, _number, false, 'Keep guessing!');
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

  /// @notice Starts a new round.
  /// @param _duration The duration of the round in seconds.
  function startRound(uint256 _duration) internal {
    roundDuration = _duration;
    roundEndTime = block.timestamp + roundDuration;
    guessingOpen = true;

    emit RoundStarted(roundEndTime);
  }

  /// @notice Starts a new game with specified round duration.
  /// @param _roundDuration The duration of each round in seconds.
  function startGame(uint256 _roundDuration) external onlyAdmin {
    require(!guessingOpen, 'A round is currently live');

    // Reset guess count for all players
    for (uint256 i = 0; i < whitelistedPlayerList.length; i++) {
      players[whitelistedPlayerList[i]].guessCount = 0;
    }

    roundDuration = _roundDuration;
    startRound(_roundDuration);
  }

  /// @notice Whitelists multiple players at once.
  /// @param _players The array of player addresses to be whitelisted.
  function bulkWhitelist(address[] calldata _players) external onlyAdmin {
    for (uint256 i = 0; i < _players.length; i++) {
      whitelistedPlayers[_players[i]] = true;
      whitelistedPlayerList.push(_players[i]);
    }
  }

  /// @notice Retrieves the leaderboard (players with guesses).
  /// @dev Returns an array of PlayerLeaderboardEntry structs containing player addresses and their corresponding guess differences.
  /// @return leaderboard An array of PlayerLeaderboardEntry structs representing the leaderboard.
  function getLeaderboard()
    external
    view
    onlyAdmin
    returns (PlayerLeaderboardEntry[] memory leaderboard)
  {
    if (!guessingOpen) {
      // Return empty leaderboard if no round is live
      return new PlayerLeaderboardEntry[](0);
    }

    uint256 length = 0;
    for (uint256 i = 0; i < whitelistedPlayerList.length; i++) {
      if (players[whitelistedPlayerList[i]].guesses.length > 0) {
        length++;
      }
    }

    leaderboard = new PlayerLeaderboardEntry[](length);

    uint256 index = 0;
    for (uint256 i = 0; i < whitelistedPlayerList.length; i++) {
      address playerAddress = whitelistedPlayerList[i];
      if (players[playerAddress].guesses.length > 0) {
        uint256[] memory playerGuesses = new uint256[](players[playerAddress].guesses.length);
        for (uint256 j = 0; j < players[playerAddress].guesses.length; j++) {
          playerGuesses[j] = players[playerAddress].guesses[j].currentDifference;
        }
        leaderboard[index] = PlayerLeaderboardEntry(playerAddress, playerGuesses);
        index++;
      }
    }

    return leaderboard;
  }

  /// @notice Returns the last secret number after a reset.
  /// @dev Can only be called if the game has been reset at least once.
  /// @return The last secret number before the current game.
  function getLastSecretNumber() external view returns (uint256) {
    require(resetCount > 0, 'No last secret number available');
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

  /// @notice Checks whether the player is registered or not.
  /// @param _player The address of the player to check.
  /// @return Whether the player is registered or not.
  function isPlayerRegistered(address _player) external view returns (bool) {
    return whitelistedPlayers[_player];
  }

  /// @notice Closes the current round, resetting leaderboard and closing guessing.
  function closeRound() external onlyAdmin {
    guessingOpen = false;
  }

  /// @notice Checks if the user is whitelisted to participate in the game.
  /// @param _user The address of the user to check.
  /// @return True if the user is whitelisted, otherwise false.
  function isUserWhitelisted(address _user) external view returns (bool) {
    return whitelistedPlayers[_user];
  }

  /// @notice Clears the leaderboard, removing all entries.
  /// @dev Only callable by an admin.
  function clearLeaderboard() external onlyAdmin {
    for (uint256 i = 0; i < whitelistedPlayerList.length; i++) {
      delete players[whitelistedPlayerList[i]].guesses;
    }
  }

  /// @notice Sets the maximum guess count for each player for each round.
  /// @dev Only callable by an admin.
  /// @param _maxGuessCount The maximum guess count per player to set.
  function setMaxGuessCount(uint256 _maxGuessCount) external onlyAdmin {
    require(_maxGuessCount > 0, 'Max guess count must be greater than zero');
    maxGuessCount = _maxGuessCount;
  }

  function isGuessingOpen() external view returns (bool) {
    return guessingOpen;
  }
}
