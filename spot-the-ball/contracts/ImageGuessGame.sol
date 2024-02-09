// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

/// @title Image Guessing Game
/// @notice This contract allows players to guess the location of an item in an image for a chance to win a prize.
contract ImageGuessGame {
  /// @dev Structure to store each challenge's details.
  struct Challenge {
    string publicImageURL; // URL of the image that is publicly visible
    string privateImageURL; // URL of the image that is revealed upon winning
    uint256[2] topLeft; // Top left coordinates of the hidden item
    uint256[2] bottomRight; // Bottom right coordinates of the hidden item
    bool isActive; // Whether the challenge is currently active
    bool isRevealed; // Whether the hidden image has been revealed
    uint256 prizePool; // Total prize pool for the challenge
  }

  Challenge[] private challenges;
  uint256 public currentChallengeIndex;
  uint256 public entryFee;
  address public owner;
  mapping(uint256 => address[]) public challengeWinners;

  /// @dev Structure for challenge creation parameters.
  struct ChallengeCreationParams {
    string publicImageURL;
    string privateImageURL;
    uint256[2] topLeft;
    uint256[2] bottomRight;
  }

  /// @dev Mapping from challenge ID to a nested mapping of player addresses to their guess coordinates.
  /// The nested mapping stores an array of 2-element uint256 arrays representing the x and y coordinates guessed by each player for the challenge.
  mapping(uint256 => mapping(address => uint256[2][])) private guessCoordinates;

  /// @dev Mapping from challenge ID to a nested mapping of player addresses to their guess timestamps.
  /// The nested mapping stores an array of timestamps representing when each guess was made by the player for the challenge.
  mapping(uint256 => mapping(address => uint256[])) private guessTimestamps;

  /// @notice Event emitted when a new challenge is created.
  /// @param challengeId The index of the challenge in the array
  /// @param imageURL URL of the publicly visible image
  /// @param prizePool The initial prize pool for the challenge
  event ChallengeCreated(uint256 indexed challengeId, string imageURL, uint256 prizePool);

  /// @notice Event emitted when a guess is submitted.
  /// @param challengeId The index of the challenge
  /// @param user The address of the user who made the guess
  /// @param isCorrect Boolean indicating if the guess was correct
  /// @param guessCoordinates The coordinates guessed by the user
  /// @param timestamp The timestamp when the guess was submitted
  event GuessSubmitted(
    uint256 indexed challengeId,
    address indexed user,
    bool isCorrect,
    uint256[2] guessCoordinates,
    uint256 timestamp
  );

  /// @notice Event emitted when a challenge is won.
  /// @param challengeId The index of the challenge
  /// @param winner The address of the winner
  /// @param prizeAmount The amount of the prize won
  event ChallengeWinner(uint256 indexed challengeId, address indexed winner, uint256 prizeAmount);

  /// @notice Event emitted when the hidden image is revealed.
  /// @param challengeId The index of the challenge
  /// @param hiddenImageURL URL of the hidden image
  event ImageRevealed(uint256 indexed challengeId, string hiddenImageURL);

  /// @notice Event indicating no more challenges are available.
  event NoMoreChallengesFound();

  /// @notice Creates a new game with an entry fee.
  /// @param _entryFee The entry fee required to submit a guess.
  constructor(uint256 _entryFee) {
    owner = msg.sender;
    entryFee = _entryFee;
    currentChallengeIndex = 0;
  }

  /// @dev Ensures only the owner can call a function.
  modifier onlyOwner() {
    require(msg.sender == owner, 'Only owner can call this function.');
    _;
  }

  /// @notice Allows the owner to create a new challenge using a struct for parameters.
  function createChallenge(ChallengeCreationParams memory params) public onlyOwner {
    // Add the new challenge to the array
    challenges.push(
      Challenge({
        publicImageURL: params.publicImageURL,
        privateImageURL: params.privateImageURL,
        topLeft: params.topLeft,
        bottomRight: params.bottomRight,
        isActive: false,
        isRevealed: false,
        prizePool: 0
      })
    );

    if (
      challenges.length == 1 ||
      (!challenges[currentChallengeIndex].isActive &&
        currentChallengeIndex + 1 == challenges.length)
    ) {
      challenges[challenges.length - 1].isActive = true;
      currentChallengeIndex = challenges.length - 1;
    }

    emit ChallengeCreated(challenges.length - 1, params.publicImageURL, 0);
  }

  /// @notice Returns public information about a challenge.
  /// @param challengeId The index of the challenge
  /// @return publicImageURL URL of the publicly visible image
  /// @return isActive Whether the challenge is currently active
  /// @return isRevealed Whether the hidden image has been revealed
  /// @return prizePool The current prize pool for the challenge
  function getChallengePublicInfo(
    uint256 challengeId
  ) public view returns (string memory, bool, bool, uint256) {
    require(challengeId < challenges.length, 'Challenge does not exist.');

    Challenge storage challenge = challenges[challengeId];
    require(challenge.isActive || challenge.isRevealed, 'No active or available challenge.');

    return (
      challenge.publicImageURL,
      challenge.isActive,
      challenge.isRevealed,
      challenge.prizePool
    );
  }

  /// @notice Allows a user to submit a guess for the current challenge.
  /// @dev Transfers the prize pool to the winner if the guess is correct.
  /// @param _challengeId The index of the challenge being guessed
  /// @param _guessCoordinates The coordinates guessed by the user
  function submitGuess(uint256 _challengeId, uint256[2] memory _guessCoordinates) public payable {
    require(msg.value == entryFee, 'Incorrect entry fee.');
    require(_challengeId == currentChallengeIndex, 'This challenge is not active.');
    Challenge storage challenge = challenges[_challengeId];
    require(challenge.isActive, 'Challenge has ended & no more challenges are available');

    guessCoordinates[_challengeId][msg.sender].push(_guessCoordinates);
    guessTimestamps[_challengeId][msg.sender].push(block.timestamp);

    challenge.prizePool += msg.value;

    bool isCorrect = isInside(challenge.topLeft, challenge.bottomRight, _guessCoordinates);
    if (isCorrect) {
      payable(msg.sender).transfer(challenge.prizePool); // Send the prize pool to the winner
      challengeWinners[_challengeId].push(msg.sender);

      emit ChallengeWinner(_challengeId, msg.sender, challenge.prizePool);
      emit ImageRevealed(_challengeId, challenge.privateImageURL);

      challenge.isActive = false;
      challenge.isRevealed = true;
      challenge.prizePool = 0;

      if (_challengeId + 1 < challenges.length) {
        currentChallengeIndex += 1;
        challenges[currentChallengeIndex].isActive = true;
      } else {
        emit NoMoreChallengesFound();
      }
    } else {
      emit GuessSubmitted(_challengeId, msg.sender, isCorrect, _guessCoordinates, block.timestamp);
    }
  }

  /// @dev Checks if a given point is within the specified coordinates.
  /// @param topLeft Top left coordinates of the hidden item
  /// @param bottomRight Bottom right coordinates of the hidden item
  /// @param point The point to check
  /// @return bool True if the point is within the coordinates, otherwise false
  function isInside(
    uint256[2] memory topLeft,
    uint256[2] memory bottomRight,
    uint256[2] memory point
  ) private pure returns (bool) {
    return
      point[0] >= topLeft[0] &&
      point[0] <= bottomRight[0] &&
      point[1] >= topLeft[1] &&
      point[1] <= bottomRight[1];
  }

  /// @notice Allows a user to view their guess coordinates and the time elapsed since each guess was made for a specific challenge.
  /// @param _challengeId The index of the challenge
  /// @return coordinates An array of guess coordinates made by the user for the specified challenge
  /// @return timesElapsed An array of times elapsed (in seconds) since each guess was made by the user
  function viewMyGuesses(
    uint256 _challengeId
  ) public view returns (uint256[2][] memory coordinates, uint256[] memory timesElapsed) {
    require(_challengeId < challenges.length, 'Challenge does not exist.');

    uint256[] storage guessTimes = guessTimestamps[_challengeId][msg.sender];
    uint256[] memory elapsedTimes = new uint256[](guessTimes.length);

    for (uint256 i = 0; i < guessTimes.length; i++) {
      // Calculate the time elapsed since the guess was made
      uint256 timeElapsed = block.timestamp - guessTimes[i];
      elapsedTimes[i] = timeElapsed;
    }

    return (guessCoordinates[_challengeId][msg.sender], elapsedTimes);
  }
}
